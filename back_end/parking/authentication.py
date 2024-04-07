from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from .models import UniversityMember

class UCIDAuthenticationBackend(ModelBackend):
    def authenticate(self, request, ucid=None, password=None, **kwargs):
        print("Authenticating UCID:", ucid)
        print("Provided Password:", password)
        try:
            university_member = UniversityMember.objects.get(ucid=ucid)
            print("User found:", university_member)
            # Print hashed password for comparison
            print("Hashed Password from Database:", university_member.password)
            # Check if the password matches
            if university_member and check_password(password, university_member.password):
                print("Authentication successful for UCID:", ucid)
                return university_member.user  # Return the associated user
        except UniversityMember.DoesNotExist:
            print("User not found for UCID:", ucid)
            return None
        print("Authentication failed for UCID:", ucid)
        return None
