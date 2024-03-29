from django.core.validators import RegexValidator
from django.db import models
from django.contrib.auth.models import AbstractUser



ucid_validator = RegexValidator(r'^\d{8}$', 'UCID must be 8 digits long.')
phone_no_validator = RegexValidator(r'^\d{9}$', 'PhoneNo must be 9 digits long.')
card_number_validator = RegexValidator(r'^\d{16}$', 'Number must be 16 digits long.')
cvv_validator = RegexValidator(r'^\d{3}$', 'CVV must be 3 digits long.')



class CustomUser(AbstractUser):
    UCID = models.CharField(max_length=8, unique=True, validators=[ucid_validator])
    PlateNo = models.CharField(max_length=7)  
    Name = models.CharField(max_length=100)
    Address = models.CharField(max_length=255)
    PhoneNo = models.CharField(max_length=9, validators=[phone_no_validator])

    # Adjustments to related_name for clarity
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='customuser_groups_set',
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='customuser_permissions_set',
        related_query_name='user',
    )



class CardInfo(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    Name = models.CharField(max_length=50)
    Number = models.CharField(max_length=16, unique=True, validators=[card_number_validator])
    ExpiryDate = models.CharField(max_length=100)
    CVV = models.CharField(max_length=3, validators=[cvv_validator])
