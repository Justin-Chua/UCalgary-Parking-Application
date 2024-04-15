from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MaxLengthValidator, MinValueValidator, MaxValueValidator, RegexValidator
from django.core.exceptions import ValidationError

class ParkingLot(models.Model):
    lot_no = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(36)], primary_key=True, unique=True
    )
    # x coordinate
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    # y coordinate
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    capacity = models.PositiveSmallIntegerField()
    occupied_spaces = models.PositiveSmallIntegerField()
    # specify flat rate, hourly + flat rate, or hourly + flat rate + reserved for parking lot
    FLAT_RATE = 'FR'
    HOURLY_PLUS_FLAT_RATE = 'H+FR'
    parking_rates = [
        (FLAT_RATE, 'Flat Rate'),
        (HOURLY_PLUS_FLAT_RATE, 'Hourly + Flat Rate'),
    ]
    rate_type = models.CharField(max_length=50, choices=parking_rates, default=HOURLY_PLUS_FLAT_RATE)

class ParkingSpace(models.Model):
    space_id = models.AutoField(primary_key=True, unique=True)
    lot_no = models.ForeignKey(
        ParkingLot, to_field='lot_no', on_delete=models.CASCADE
    )
    zone = models.CharField(max_length=1)
    stall_no = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(99)]
    )

class Vehicle(models.Model):
    plate_no = models.CharField(max_length=7, primary_key=True, unique=True)
    make = models.CharField(max_length=20)
    model = models.CharField(max_length=100)
    lot_no = models.OneToOneField(
        ParkingLot, to_field='lot_no', on_delete=models.SET_NULL, null=True
    )
    owner = models.ForeignKey(User, related_name='vehicles', on_delete=models.CASCADE, default=None)
    
    def update_vehicle(self, lot_no=None):
        if lot_no:
            self.lot_no = lot_no
        self.save()


class Color(models.Model):
    plate_no = models.OneToOneField(
        Vehicle, to_field='plate_no', on_delete=models.CASCADE, primary_key=True
    )
    vehicle_color = models.CharField(max_length=50)
    
class UniversityMember(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    ucid = models.CharField(
        primary_key=True,
        validators=[
            MinLengthValidator(8),
            MaxLengthValidator(8),
            RegexValidator(regex='^\d{8}$', message="UCID must be exactly 8 digits.")
        ],
        max_length=8,
        unique=True
    )
    name = models.CharField(max_length=200)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone_no = models.CharField(
        validators=[
            MinLengthValidator(10),
            MaxLengthValidator(10),
            RegexValidator(regex='^\d{10}$', message="Phone number must be exactly 10 digits.")
        ],
        max_length=10
    )
    
    def clean(self):
        if self.phone_no and len(self.phone_no) != 10:
            raise ValidationError('Phone number must be exactly 10 digits long.')

    def update_profile(self, address=None, phone_no=None, password=None):
        if address:
            self.address = address
        if phone_no:
            self.phone_no = phone_no
        if password:
            self.password = make_password(password)
        self.save()

class Client(models.Model):
    client_ucid = models.OneToOneField(
        UniversityMember, to_field='ucid', on_delete=models.CASCADE, primary_key=True
    )
    plate_no = models.ForeignKey(
        Vehicle, to_field='plate_no', on_delete=models.SET_NULL, null=True
    )

class ParkingAdmin(models.Model):
    admin_ucid = models.OneToOneField(
        UniversityMember, to_field='ucid', on_delete=models.CASCADE, primary_key=True
    )

class Patrols(models.Model):
    lot_no = models.OneToOneField(
        ParkingLot, to_field='lot_no', on_delete=models.CASCADE
    )
    admin_ucid = models.OneToOneField(
        ParkingAdmin, to_field='admin_ucid', on_delete=models.CASCADE
    )
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['lot_no', 'admin_ucid'], name='patrols_primary_keys')
        ]

class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True, unique=True)
    client_ucid = models.ForeignKey(
        Client, to_field='client_ucid', on_delete=models.CASCADE
    )
    title = models.CharField(max_length=50)
    message = models.TextField(max_length=300)

class Payment(models.Model):
    payment_no = models.AutoField(primary_key=True, unique=True)
    client_ucid = models.ForeignKey(
        Client, to_field='client_ucid', on_delete=models.CASCADE
    )
    cc_holder = models.CharField(max_length=200)
    cc_number = models.CharField(
        primary_key=False,
        validators=[
            MinLengthValidator(12),
            MaxLengthValidator(19),
            RegexValidator(regex=r'^\d{12,19}$', message="Credit number must be between 12 and 19 digits long")
        ],
        max_length=19
    )
    cvc = models.CharField(
        primary_key=False,
        validators=[
            MinLengthValidator(3),
            MaxLengthValidator(3),
            RegexValidator(regex='^\d{3}$', message="Cvc must be 3 digits long")
        ],
        max_length=3
    )
    cc_expiry_month = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)]
    )
    cc_expiry_year = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(99)]
    )
    
class Ticket(models.Model):
    ticket_no = models.AutoField(primary_key=True, unique=True)
    notification_id = models.ForeignKey(
        Notification, to_field='notification_id', on_delete=models.SET_NULL, null=True
    )
    payment_no = models.ForeignKey(
        Payment, to_field='payment_no', on_delete=models.SET_NULL, null=True
    )
    client_ucid = models.ForeignKey(
        Client, to_field='client_ucid', on_delete=models.CASCADE
    )
    admin_ucid = models.ForeignKey(
        ParkingAdmin, to_field='admin_ucid', on_delete=models.SET_NULL, null=True
    )
    issue_date = models.DateField()
    due_date = models.DateField()
    offense = models.CharField(max_length=50)
    amount_due = models.PositiveSmallIntegerField()
    paid = models.BooleanField(default=False)

class ParkingPermit(models.Model):
    permit_no = models.AutoField(primary_key=True, unique=True)
    client_ucid = models.ForeignKey(
        Client, to_field='client_ucid', on_delete=models.CASCADE
    )
    admin_ucid = models.ForeignKey(
        ParkingAdmin, to_field='admin_ucid', on_delete=models.SET_NULL, null=True
    )
    payment_no = models.ForeignKey(
        Payment, to_field='payment_no', on_delete=models.CASCADE
    )
    pp_issue_date = models.DateField()
    pp_expiry_date = models.DateField()
    pp_amount_due = models.PositiveSmallIntegerField()

class Reservation(models.Model):
    lot_no = models.ForeignKey(
        ParkingLot, to_field='lot_no', on_delete=models.CASCADE
    )
    client_ucid = models.ForeignKey(
        Client, to_field='client_ucid', on_delete=models.SET_NULL, null=True
    )
    payment_no = models.ForeignKey(
        Payment, to_field='payment_no', on_delete=models.CASCADE
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    res_amount_due = models.PositiveSmallIntegerField()
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['lot_no', 'client_ucid'], name='reservation_primary_keys')
        ]

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        """A string representation of the model."""
        return self.title









