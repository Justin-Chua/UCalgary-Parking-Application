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
from .serializers import TodoSerializer, UniversityMemberSerializer, UserSerializer

class ListTodo(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class DetailTodo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class SignupView(APIView):
    def post(self, request, format=None):
        # Extract user data from the request
        user_data = {
            'username': request.data.get('email'),  # Assuming email is unique and can be used as username
            'email': request.data.get('email'),
            'password': make_password(request.data.get('password')),  # Hash the password
        }
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            # Save the user instance
            user = user_serializer.save()
            # Extract university member data from the request
            university_member_data = {
                'ucid': request.data.get('ucid'),
                'name': request.data.get('name'),
                'email': request.data.get('email'),
                'password': user.password,  # Store hashed password
                'address': request.data.get('address'),
                'phone_no': request.data.get('phone_no'),
                'user': user.id
            }
            university_member_serializer = UniversityMemberSerializer(data=university_member_data)
            if university_member_serializer.is_valid():
                # Save the university member instance
                university_member_serializer.save()
                return Response(university_member_serializer.data, status=status.HTTP_201_CREATED)
            else:
                # Delete the user instance if university member creation fails
                user.delete()
                # Debug: Print serializer errors
                print("University Member Serializer Errors:", university_member_serializer.errors)
                return Response(university_member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Debug: Print serializer errors
            print("User Serializer Errors:", user_serializer.errors)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class LoginView(APIView):
    def post(self, request):
        # Retrieve credentials from request
        ucid = request.data.get('ucid')
        password = request.data.get('password')

        print("Received UCID:", ucid)
        print("Received Password:", password)

        # Authenticate user using custom backend
        user = authenticate(request, ucid=ucid, password=password)

        if user is not None:
            # Generate token for the authenticated user
            token = RefreshToken.for_user(user)
            print("Token generated:", token)
            return Response({'token': str(token.access_token)})
        else:
            print("Authentication failed for UCID:", ucid)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



        


class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            university_member = UniversityMember.objects.get(user=user)
            serializer = UniversityMemberSerializer(university_member)
            return Response(serializer.data)
        except UniversityMember.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        
   
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)