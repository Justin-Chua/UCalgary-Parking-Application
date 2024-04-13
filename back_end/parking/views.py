# todos/views.py
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import (
    ParkingAdmin, Todo, UniversityMember, 
    Vehicle, Color, Client,
    ParkingLot)  # Import Color model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from .authentication import UCIDAuthenticationBackend
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .serializers import (
    ClientSerializer, TodoSerializer, UniversityMemberSerializer, 
    UserSerializer, VehicleSerializer, ParkingLotSerializer)


class ListTodo(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class DetailTodo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class MapView(APIView):
    # fetch all parking lots
    def get(self, request):
        parking_lot_set = ParkingLot.objects.all()
        serializer = ParkingLotSerializer(parking_lot_set, many=True)
        return Response(serializer.data)

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
    acceptable_colors = {'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange'}
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