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
from .models import Todo, UniversityMember
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from .authentication import UCIDAuthenticationBackend
from rest_framework.exceptions import ValidationError
from .serializers import TodoSerializer, UniversityMemberSerializer, UserSerializer

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