from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, CardInfo

class RegistrationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['UCID', 'PlateNo', 'Name', 'email', 'password1', 'password2', 'Address', 'PhoneNo']

class CardForm(forms.ModelForm):  # Corrected inheritance
    class Meta:
        model = CardInfo
        fields = ['Name', 'Number', 'ExpiryDate', 'CVV']  # Updated to 'ExpiryDate' and 'CVV'

