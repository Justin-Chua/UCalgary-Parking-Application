# todos/views.py
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Todo, UniversityMember
from .serializers import TodoSerializer, UniversityMemberSerializer


class ListTodo(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class DetailTodo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class SignupView(APIView):
    def post(self, request, format=None):
        serializer = UniversityMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class LoginView(APIView):
    def post(self, request, format=None):
        data = request.data
        ucid = data.get('ucid')
        password = data.get('password')
        
        # Retrieve the user from the database based on the UCID
        try:
            user = UniversityMember.objects.get(ucid=ucid)
        except UniversityMember.DoesNotExist:
            user = None
        
        # Check if the user exists and if the password matches
        if user is not None and user.password == password:
            # Set session variable to indicate user is logged in
            request.session['ucid'] = user.ucid
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            # Authentication failed
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        
        