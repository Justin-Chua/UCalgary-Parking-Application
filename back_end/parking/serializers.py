# todos/serializers.py
from rest_framework import serializers
from .models import Todo, UniversityMember
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User



class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'title',
            'description',
        )
        model = Todo
        
        
class UniversityMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityMember
        fields = ['ucid', 'name', 'email', 'password', 'address', 'phone_no', 'user']
        
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # Ensure password is write-only