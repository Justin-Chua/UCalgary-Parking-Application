# todos/serializers.py
from rest_framework import serializers
from .models import Ticket, Todo, UniversityMember, Vehicle, Color, Client
from rest_framework import exceptions
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
        
        
class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['vehicle_color']

class VehicleSerializer(serializers.ModelSerializer):
    plateNumber = serializers.CharField(source='plate_no')  # Update field name to 'plateNumber'
    color = serializers.CharField(source='color.vehicle_color')  # Include color as a string field

    class Meta:
        model = Vehicle
        fields = ['plateNumber', 'make', 'model', 'color']

    def create(self, validated_data):
        # Extract color data if provided
        color_data = validated_data.pop('color', None)
        
        # If color data is provided and it's a string, create a Color object
        if color_data and isinstance(color_data, str):
            color, _ = Color.objects.get_or_create(vehicle_color=color_data)
            validated_data['color'] = color

        # Create and return the vehicle instance
        return super().create(validated_data)


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['client_ucid', 'plate_no']  # Add fields as needed


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'