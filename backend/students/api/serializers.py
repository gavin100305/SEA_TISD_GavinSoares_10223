# students/api/serializers.py
from rest_framework import serializers
from students.models import Project
from college.models import CollegeProfile,NGO
from mentor.models import MentorProfile
from college.serializers import CollegeProfileSerializer

# class CollegeProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CollegeProfile
#         fields = ['id', 'college_name', 'location', 'logo']

class MentorProfileSerializer(serializers.ModelSerializer):
    college = CollegeProfileSerializer(read_only=True)
    
    class Meta:
        model = MentorProfile
        fields = [
            'id', 'full_name', 'college', 'profile_picture', 'phone',
            'highest_qualification', 'university', 'specialization',
            'current_role', 'experience_years', 'teaching_branch',
            'expertise_areas', 'bio', 'linkedin', 'website',
            'verification_status', 'created_at'
        ]

class ProjectSerializer(serializers.ModelSerializer):
    mentor = MentorProfileSerializer(read_only=True)
    college = CollegeProfileSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'sdgs', 'tech_stack',
            'github_link', 'status', 'mentor', 'college',
            'is_open_for_collaboration', 'created_at', 'updated_at',
            'project_image1', 'project_image2', 'project_image3',
            'project_image4', 'project_image5'
        ]
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert image fields to full URLs
        request = self.context.get('request')
        for i in range(1, 6):
            image_field = f'project_image{i}'
            if representation.get(image_field):
                representation[image_field] = request.build_absolute_uri(representation[image_field])
        return representation

class NGOSerializer(serializers.ModelSerializer):
    college = CollegeProfileSerializer(read_only=True)
    
    class Meta:
        model = NGO
        fields = [
            'id', 'name', 'description', 'requirements',
            'contact_person', 'contact_email', 'contact_phone',
            'website', 'address', 'image', 'is_active',
            'created_at', 'college'
        ]
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert image field to full URL
        request = self.context.get('request')
        if representation.get('image'):
            representation['image'] = request.build_absolute_uri(representation['image'])
        return representation