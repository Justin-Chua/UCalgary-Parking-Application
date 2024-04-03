# In yourapp/management/commands/create_member.py
from django.core.management.base import BaseCommand
from parking.models import UniversityMember

class Command(BaseCommand):
    help = 'Creates a UniversityMember instance'

    def handle(self, *args, **options):
        # Create an instance of UniversityMember
        member = UniversityMember(
            ucid=12345678,
            name='John',
            email='john@example.com',
            password='password',
            address='123 Street',
            phone_no=1234567890
        )

        # Save the instance to the database
        member.save()
        self.stdout.write(self.style.SUCCESS('UniversityMember created successfully'))
