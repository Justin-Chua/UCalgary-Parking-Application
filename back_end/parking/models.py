from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, MinValueValidator, MaxValueValidator

class ParkingLot(models.Model):
    lot_no = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(36)]
    )
    # x coordinate
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    # y coordinate
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    capacity = models.PositiveSmallIntegerField()
    occupied_spaces = models.PositiveSmallIntegerField()

class ParkingSpace(models.Model):
    lot_no = models.ForeignKey(
        ParkingLot, to_field='lot_no', on_delete=models.CASCADE, on_update=models.CASCADE, primary_key=True
    )
    zone = models.CharField(max_length=1)
    stall_no = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(99)]
    )

class Vehicle(models.Model):
    plate_no = models.CharField(max_length=7)
    make = models.CharField(max_length=20)
    model = models.charField(max_length=100)
    lot_no = models.ForeignKey(
        ParkingLot, to_field='lot_no', on_delete=models.SET_NULL, on_update=models.CASCADE
    )

class Color(models.Model):
    plate_no = models.Foreignkey(
        Vehicle, to_field='plate_no', on_delete=models.CASCADE, on_update=models.CASCADE, primary_key=True
    )
    vehicle_color = models.CharField(max_length=50)
    
class UniversityMember(models.Model):
    ucid = models.PositiveIntegerField(
        primary_key=True,
        validators=[MinLengthValidator(8), MaxLengthValidator(8)]
    )
    name = models.CharField(max_length=200)
    email = models.EmailField(max_length=254)
    password = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone_no = models.PositiveIntegerField(
        validators=[MinLengthValidator(10), MaxLengthValidator(10)]
    )

class Client(models.Model):
    client_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.CASCADE, on_update=models.CASCADE
    )
    plate_no = models.ForeignKey(
        Vehicle, to_field='plate_no', on_delete=models.SET_NULL, on_update=models.CASCADE
    )

class ParkingAdmin(models.Model):
    admin_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.CASCADE, on_update=models.CASCADE
    )

class Patrols(models.Model):
    lot_no = models.ForeignKey(
        ParkingLot, to_field='lot_no', on_delete=models.CASCADE, on_update=models.CASCADE, primary_key=True
    )
    admin_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.SET_NULL, on_update=models.CASCADE, primary_key=True
    )

class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    client_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.CASCADE, on_update=models.CASCADE
    )
    title = models.CharField(max_length=50)
    message = models.TextField(max_length=300)

class Payment(models.Model):
    payment_no = models.AutoField(primary_key=True)
    client_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.CASCADE, on_update=models.CASCADE)
    cc_holder = models.CharField(max_length=200)
    cc_number = models.PositiveIntegerField(
        validators=[MinLengthValidator(12), MaxLengthValidator(19)]
    )
    cvc = models.PositiveSmallIntegerField(
        validators=[MinLengthValidator(3), MaxLengthValidator(3)]
    )
    cc_expiry_month = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)]
    )
    cc_expiry_year = models.PositiveSmallIntegerField(
        validators=[MinLengthValidator(2), MaxLengthValidator(2)]
    )
    
class Ticket(models.Model):
    ticket_no = models.AutoField(primary_key=True)
    notification_id = models.ForeignKey(
        Notification, to_field='notification_id', on_delete=models.SET_NULL, on_update=models.CASCADE
    )
    payment_no = models.ForeignKey(
        Payment, to_field='payment_no', on_delete=models.SET_NULL, on_update=models.CASCADE
    )
    client_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.CASCADE, on_update=models.CASCADE
    )
    admin_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.SET_NULL, on_update=models.CASCADE
    )
    issue_date = models.DateField()
    due_date = models.DateField()
    offense = models.CharField(max_length=50)
    amount_due = models.PositiveSmallIntegerField()
    paid = models.BooleanField(default=False)

class ParkingPermit(models.Model):
    permit_no = models.AutoField(primary_key=True)
    client_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.CASCADE, on_update=models.CASCADE
    )
    admin_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.SET_NULL, on_update=models.CASCADE
    )
    payment_no = models.ForeignKey(
        Payment, to_field='payment_no', on_delete=models.CASCADE, on_update=models.CASCADE
    )
    pp_issue_date = models.DateField()
    pp_expiry_date = models.DateField()
    pp_amount_due = models.PositiveSmallIntegerField()

class Reservation(models.Model):
    lot_no = models.ForeignKey(
        ParkingLot, to_field='lot_no', on_delete=models.CASCADE, on_update=models.CASCADE, primary_key=True
    )
    client_ucid = models.ForeignKey(
        UniversityMember, to_field='ucid', on_delete=models.SET_NULL, on_update=models.CASCADE, primary_key=True
    )
    payment_no = models.ForeignKey(
        Payment, to_field='payment_no', on_delete=models.CASCADE, on_update=models.CASCADE
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    res_amount_due = models.PositiveSmallIntegerField()

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        """A string representation of the model."""
        return self.title









