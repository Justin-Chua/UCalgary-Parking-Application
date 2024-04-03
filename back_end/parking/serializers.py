# todos/serializers.py
from rest_framework import serializers
from .models import Todo, UniversityMember


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
        fields = '__all__' 