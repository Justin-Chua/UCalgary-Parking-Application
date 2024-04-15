# todos/serializers.py
from rest_framework import serializers
from .models import Todo, UniversityMember, Vehicle, Color, Client, ParkingLot, Ticket, ParkingPermit, Reservation, Payment, Notification
from rest_framework import exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
        
class ParkingLotSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'lot_no',
            'latitude',
            'longitude',
            'capacity',
            'occupied_spaces',
            'rate_type'
        )
        model = ParkingLot

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'ticket_no',
            'notification_id',
            'payment_no',
            'client_ucid',
            'admin_ucid',
            'issue_date',
            'due_date',
            'offense',
            'amount_due',
            'paid'
        )
        model = Ticket

class ParkingPermitSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'permit_no',
            'client_ucid',
            'admin_ucid',
            'payment_no',
            'pp_issue_date',
            'pp_expiry_date',
            'pp_amount_due'
        )
        model = ParkingPermit

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'lot_no',
            'client_ucid',
            'payment_no',
            'date',
            'start_time',
            'end_time',
            'res_amount_due'
        )
        model = Reservation

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'notification_id',
            'client_ucid',
            'title',
            'message'
        )
        model = Notification

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


class VehiclesDataSerializer(serializers.ModelSerializer):
        class Meta:
            model = Vehicle
            fields = ['plate_no', 'make', 'model', 'lot_no_id', 'owner']
            
class PaymentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Payment
            fields = ['client_ucid', 'cc_holder', 'cc_number', 'cvc', 'cc_expiry_month', 'cc_expiry_year']

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['client_ucid', 'plate_no']  # Add fields as needed


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

