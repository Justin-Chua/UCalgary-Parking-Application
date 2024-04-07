# In yourapp/management/commands/create_member.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from parking.models import UniversityMember

class Command(BaseCommand):
    help = 'Creates a UniversityMember instance'

    def handle(self, *args, **options):
        # Create a User instance
        user = User.objects.create_user(username='username', email='user@example.com', password='password')

        # Create an instance of UniversityMember
        member = UniversityMember(
            user=user,  # Associate the User instance with the UniversityMember
            ucid='12345678',
            name='Jill',
            email='jill@example.com',
            password='password',
            address='123 Street',
            phone_no='1234567890'
        )

        # Save the instance to the database
        member.save()
        self.stdout.write(self.style.SUCCESS('UniversityMember created successfully'))
