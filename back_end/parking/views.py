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
from .models import Todo, UniversityMember, Vehicle, Color, ParkingLot # Import Color model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from .authentication import UCIDAuthenticationBackend
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .serializers import TodoSerializer, UniversityMemberSerializer, UserSerializer, VehicleSerializer, ParkingLotSerializer, VehiclesDataSerializer


class ListTodo(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class DetailTodo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


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
               
                university_member_serializer.save()
                return Response(university_member_serializer.data, status=status.HTTP_201_CREATED)
            else:
               
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

        print("Received UCID:", ucid)
        print("Received Password:", password)

        
        user = authenticate(request, ucid=ucid, password=password)

        if user is not None:
            
            token = RefreshToken.for_user(user)
            print("Token generated:", token)
            return Response({'token': str(token.access_token)})
        else:
            print("Authentication failed for UCID:", ucid)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



        


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
        
    
class MapView(APIView):
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
            
            lot_no = request.query_params.get('lot_no')
            vehicle_data.update_vehicle(lot_no=lot_no)
        except Vehicle.DoesNotExist:
            return Response({'error': 'No vehicle found with the provided plate number'}, status=404)
        return Response({'message': 'Lot number added successfully'})