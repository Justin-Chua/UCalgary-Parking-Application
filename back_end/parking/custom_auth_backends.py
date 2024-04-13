# custom_auth_backends.py

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from .models import UniversityMember

class UserTypeAuthenticationBackend(ModelBackend):
    def authenticate(self, request, ucid=None, password=None, **kwargs):
        try:
            university_member = UniversityMember.objects.get(ucid=ucid)
            
            if university_member and check_password(password, university_member.password):
                user_type = "client" if hasattr(university_member, 'client') else "admin"
                return university_member.user, user_type
        except UniversityMember.DoesNotExist:
            pass
