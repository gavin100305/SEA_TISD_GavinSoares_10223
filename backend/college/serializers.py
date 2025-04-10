from rest_framework import serializers
from .models import CollegeProfile

class CollegeProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the CollegeProfile model.
    """
    class Meta:
        model = CollegeProfile
        fields = [
            'id', 'user', 'college_name', 'college_code', 'address',
            'contact_number', 'website', 'established_year', 'principal_name',
            'principal_email', 'total_students', 'total_faculty', 'is_verified'
        ]
        read_only_fields = ['user', 'is_verified'] 