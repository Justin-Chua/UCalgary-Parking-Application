# todos/views.py
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate, login
from django.views import View
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.db.models import Max
from .models import (
    ParkingAdmin, ParkingSpace, UniversityMember, 
    Vehicle, Color, Client, Payment,
    ParkingLot, Ticket, ParkingPermit,
    Reservation, Notification)  # Import Color model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from .authentication import UCIDAuthenticationBackend
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .serializers import (
    ClientSerializer, ParkingSpaceSerializer, UniversityMemberSerializer, 
    UserSerializer, VehicleSerializer, ParkingLotSerializer, 
    TicketSerializer, ParkingPermitSerializer, ReservationSerializer,
    PaymentSerializer, VehiclesDataSerializer, NotificationSerializer)

class MapView(APIView):
    # fetch all parking lots
    def get(self, request):
        parking_lot_set = ParkingLot.objects.all()
        serializer = ParkingLotSerializer(parking_lot_set, many=True)
        return Response(serializer.data)
    
class TicketView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        client = Client.objects.get(client_ucid__user=request.user)
        user_tickets = Ticket.objects.filter(client_ucid=client)
        serializer = TicketSerializer(user_tickets, many=True)
        return Response(serializer.data)

class ParkingPermitView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        client = Client.objects.get(client_ucid__user=request.user)
        user_permits = ParkingPermit.objects.filter(client_ucid=client)
        serializer = ParkingPermitSerializer(user_permits, many=True)
        return Response(serializer.data)
    
    
        
    
class ReservationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        client = Client.objects.get(client_ucid__user=request.user)
        user_reservations = Reservation.objects.filter(client_ucid=client)
        serializer = ReservationSerializer(user_reservations, many=True)
        return Response(serializer.data) 
    
class MakeReservationView(APIView):  
    def post(self, request):
        client_ucid = request.data.get('client_ucid')
        ucidClient = Client.objects.get(client_ucid_id=client_ucid)
        payment = Payment.objects.filter(client_ucid_id=client_ucid)
        max_number = payment.aggregate(Max('payment_no'))['payment_no__max']  # Returns the highest number.
        latest_payment = Payment.objects.get(payment_no=max_number)  # Filter all payment by this number.
        latest_payment_no = latest_payment.payment_no
        
        reserve_data = {
            'lot_no':request.data.get('lot_no'),
            'client_ucid': ucidClient,
            'payment_no': latest_payment_no, 
            'date': request.data.get('date'), 
            'start_time':request.data.get('start_time'), 
            'end_time': request.data.get('end_time'),
            'res_amount_due':request.data.get('res_amount_due')
        }

        reserve_serializer = ReservationSerializer(data=reserve_data)
        print("reservation validation: ",reserve_serializer.is_valid())
        if reserve_serializer.is_valid():
            reserve_serializer.save()
            return Response(reserve_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("reserve Serializer Errors:", reserve_serializer.errors)
            return Response(reserve_serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

    
class NotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        client = Client.objects.get(client_ucid__user=request.user)
        user_notifications = Notification.objects.filter(client_ucid=client)
        serializer = NotificationSerializer(user_notifications, many=True)
        return Response(serializer.data)
    
    def delete(self, request):
        try:
            notification = Notification.objects.get(notification_id=request.data.get('id'))
            notification.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    
class SignupView(APIView):
    def post(self, request, format=None):
        user_data = {
            'username': request.data.get('email'),  
            'email': request.data.get('email'),
            'password': make_password(request.data.get('password')),  
        }
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            
            user = user_serializer.save()
           
            university_member_data = {
                'ucid': request.data.get('ucid'),
                'name': request.data.get('name'),
                'email': request.data.get('email'),
                'password': user.password,  
                'address': request.data.get('address'),
                'phone_no': request.data.get('phone_no'),
                'user': user.id
            }
            university_member_serializer = UniversityMemberSerializer(data=university_member_data)
            if university_member_serializer.is_valid():
                
                university_member = university_member_serializer.save()
                
                # Create a Client instance for the newly created UniversityMember
                client_data = {
                    'client_ucid': university_member.ucid
                }
                client_serializer = ClientSerializer(data=client_data)
                if client_serializer.is_valid():
                    client_serializer.save()
                    return Response(university_member_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    # If there's an error creating the Client, delete the UniversityMember and User
                    user.delete()
                    university_member.delete()
                    print("Client Serializer Errors:", client_serializer.errors)
                    return Response(client_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                # If there's an error with UniversityMember data, delete the User
                user.delete()
                print("University Member Serializer Errors:", university_member_serializer.errors)
                return Response(university_member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("User Serializer Errors:", user_serializer.errors)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class LoginView(APIView):
    def post(self, request):
        ucid = request.data.get('ucid')
        password = request.data.get('password')

        user = authenticate(request, ucid=ucid, password=password)
        token = None  # Define token variable with initial value None
        
        if user is not None:
            university_member = UniversityMember.objects.get(user=user)
            if hasattr(university_member, 'client'):  # Check if the university member has a client instance
                token = RefreshToken.for_user(user)
            elif hasattr(university_member, 'parkingadmin'):  # Check if the university member is a ParkingAdmin
                token = RefreshToken.for_user(user)  # Refresh token here as well, assuming same behavior for ParkingAdmin
                return Response({'token': str(token.access_token), 'redirect': 'usersearch/'})
            else:
                return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Return response with token if defined
        if token:
            return Response({'token': str(token.access_token)})
        else:
            return Response({'error': 'Token not generated'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        university_member = UniversityMember.objects.get(user=request.user)
        serializer = UniversityMemberSerializer(university_member)
        return Response(serializer.data)

    def post(self, request):
        university_member = UniversityMember.objects.get(user=request.user)
        address = request.data.get('address')
        phone_no = request.data.get('phoneNo')
        password = request.data.get('password')

        if not (address or phone_no or password):
            raise ValidationError('No data provided for updating profile.')

        if phone_no and len(phone_no) != 10:
            raise ValidationError('Phone number must be exactly 10 digits long.')

        university_member.update_profile(address=address, phone_no=phone_no, password=password)
        return Response({'message': 'Profile updated successfully'})
        
   
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        

class AddVehicleView(APIView):
    def post(self, request, *args, **kwargs):
        vehicle_serializer = VehicleSerializer(data=request.data)
        color_name = request.data.get('color', '').lower()  # Extract color from request data
        
        # Check if the color is valid
        if not is_valid_color(color_name):
            return Response({'error': 'Invalid color.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate vehicle data
        if vehicle_serializer.is_valid():
            # Save vehicle
            vehicle = vehicle_serializer.save(owner=request.user)
            
            # Save or update color
            color, _ = Color.objects.get_or_create(plate_no=vehicle, defaults={'vehicle_color': color_name})
            if not _:
                color.vehicle_color = color_name
                color.save()
            
            # Return response with color information
            vehicle_data = vehicle_serializer.data
            vehicle_data['color'] = color_name
            return Response(vehicle_data, status=status.HTTP_201_CREATED)
        else:
            return Response(vehicle_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def is_valid_color(color_name):
    acceptable_colors = {'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'gray'}
    return color_name in acceptable_colors



class ViewVehicleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicles = Vehicle.objects.filter(owner=request.user)
        serializer = VehicleSerializer(vehicles, many=True)
        # Include color information in the serialized data
        serialized_data = []
        for vehicle_data in serializer.data:
            color = Color.objects.filter(plate_no=vehicle_data['plateNumber']).first()
            if color:
                vehicle_data['color'] = color.vehicle_color
                print(f"Color fetched for plate number {vehicle_data['plateNumber']}: {color.vehicle_color}")
            else:
                vehicle_data['color'] = 'Color not specified'
                print(f"No color found for plate number {vehicle_data['plateNumber']}")
            serialized_data.append(vehicle_data)
        return Response(serialized_data)


class DeleteVehicleView(APIView):
    def delete(self, request):
        try:
            vehicle = Vehicle.objects.get(owner=request.user)
            vehicle.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Vehicle.DoesNotExist:
            return Response("Vehicle not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class MapPopupView(APIView):
    def get(self, request):
        lot_no = request.query_params.get('lot_no')
        park_lot = ParkingLot.objects.filter(lot_no=lot_no)
        if not park_lot.exists():
            return Response({'error': 'No parking lot found with the provided lot number'}, status=404)
        serializer = ParkingLotSerializer(park_lot, many=True)
        return Response(serializer.data)
    
class VehiclesDataView(APIView):
    
    def get(self, request):
        plate_no = request.query_params.get('plate_no')
        platenumber = Vehicle.objects.filter(plate_no=plate_no)
        if not platenumber.exists():
            return Response({'error': 'No vehicle found with the provided plate number'}, status=404)
        serializer = VehiclesDataSerializer(platenumber, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        
        try:
            plate_no = request.query_params.get('plate_no')
            vehicle_data = Vehicle.objects.get(plate_no=plate_no)
            
            lot_no_str = request.data.get('lot_no')  # Access lot_no from request data
            
            # Fetch ParkingLot instance corresponding to the lot_no string
            parking_lot = ParkingLot.objects.get(lot_no=lot_no_str)

            
            # Assign ParkingLot instance to the Vehicle's lot_no field
            vehicle_data.lot_no = parking_lot
            vehicle_data.save()  # Save the changes
            
        except Vehicle.DoesNotExist:
            return Response({'error': 'No vehicle found with the provided plate number'}, status=404)
        except ParkingLot.DoesNotExist:
            return Response({'error': 'No parking lot found with the provided lot number'}, status=404)
        
        return Response({'message': 'Lot number added successfully'})
   
class UserSearchView(APIView):
    def get(self, request):
        license_plate = request.query_params.get('licensePlate')
        if not license_plate:
            return Response({'error': 'License plate parameter is missing'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Query the Vehicle model to get the vehicle with the provided license plate
        vehicle = get_object_or_404(Vehicle, plate_no=license_plate)
        
        # Get the owner of the vehicle
        user = vehicle.owner
        
        # Serialize the user data along with the plate number
        serializer = UniversityMemberSerializer(user.universitymember)
        serialized_data = serializer.data
        serialized_data['plateNumber'] = license_plate  # Add the plate number to the serialized data
        
        return Response(serialized_data)
    
class CheckAdminStatus(APIView):
    def get(self, request):
        user = request.user
        try:
            admin = ParkingAdmin.objects.get(admin_ucid=user.universitymember)
            print("hi")
            return Response({'isAdmin': True})
        except ParkingAdmin.DoesNotExist:
            print("not hi")
            return Response({'isAdmin': False})
        
        
class TicketCreateView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            client_ucid = serializer.validated_data['client_ucid']
            
            # Retrieve the ParkingAdmin instance associated with the logged-in user's university member
            admin_ucid = ParkingAdmin.objects.get(admin_ucid=request.user.universitymember)
            
            ticket = serializer.save(admin_ucid=admin_ucid)
            
            # Create a notification for the client
            notification = Notification.objects.create(
                client_ucid=client_ucid,
                title="Parking Ticket Received",
                message="You have received a new parking ticket.",
            )
            
            ticket.notification_id = notification  # Associate the ticket with the notification
            ticket.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PaymentView(APIView):

    def post(self, request):
            
        client_ucid = request.data.get('client_ucid')
        ucidClient = Client.objects.get(client_ucid_id=client_ucid)
        
        payment_data = {
            'client_ucid':client_ucid,
            'cc_holder': request.data.get('cc_holder'), 
            'cc_number': request.data.get('cc_number'), 
            'cvc': request.data.get('cvc'), 
            'cc_expiry_month':request.data.get('cc_expiry_month'), 
            'cc_expiry_year': request.data.get('cc_expiry_year')
        }

        payment_serializer = PaymentSerializer(data=payment_data)

        if payment_serializer.is_valid():
            payment_serializer.save()
            return Response(payment_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Payment Serializer Errors:", payment_serializer.errors)
            return Response(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientConditionsChecker(APIView):
    def get(self, request):
        client_ucid = request.query_params.get('client_ucid')
        if not client_ucid:
            return Response({'error': 'Client UCID parameter is missing'}, status=status.HTTP_400_BAD_REQUEST)
        
        permit_exists, ticket_count = self.check_client_conditions(client_ucid)
        return Response({'permit_exists': permit_exists, 'ticket_count': ticket_count})

    def check_client_conditions(self, client_ucid):
        client = Client.objects.get(client_ucid=client_ucid)
        permit_exists = ParkingPermit.objects.filter(client_ucid=client).exists()
        ticket_count = Ticket.objects.filter(client_ucid=client).count()
        return permit_exists, ticket_count
    
    
class RevokePermitView(APIView):
    def delete(self, request):
        client_ucid = request.data.get('client_ucid')
        permit = get_object_or_404(ParkingPermit, client_ucid=client_ucid)
        permit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class DetailedLotData(APIView):
    def get(self, request, lot_no):
        try:
            # Retrieve occupancy data for the specified lot number
            
            detailed_lot = detailed_lot.objects.get(lot_no=lot_no)
            # Assume you have a field named 'occupied_spaces' in your DetailedLot model
            occupied_spaces = detailed_lot.occupied_spaces
            # Further processing to format the data as needed
            
            # Return the occupancy data as a JSON response
            return Response({'parking_spaces': occupied_spaces}, status=status.HTTP_200_OK)
        except detailed_lot.DoesNotExist:
            # Handle case where lot number is not found
            return Response({'error': 'Lot number not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Handle other exceptions
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class ParkingSpaceListView(APIView):
    def get(self, request):
        lot_no = request.query_params.get('lot_no')
        ParkingInfo = ParkingLot(lot_no=lot_no)
        queryset = ParkingSpace.objects.filter(lot_no=ParkingInfo)
        serializer_class = ParkingSpaceSerializer(queryset, many = True)
        return Response(serializer_class.data)
    
    
class UpdateParkingSpace(View):
    def post(self, request):
        data = request.POST  # Assuming data is sent via POST request
        lot_no = data.get('lot_no')
        space_id = data.get('space_id')

        try:
            parking_space = ParkingSpace.objects.get(lot_no=lot_no, space_id=space_id)
            parking_space.occupied = True
            parking_space.save()
            return JsonResponse({'message': 'ParkingSpace updated successfully'}, status=200)
        except ParkingSpace.DoesNotExist:
            return JsonResponse({'error': 'ParkingSpace not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)