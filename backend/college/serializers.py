from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CollegeProfile, NGO, ProjectAssessment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CollegeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='user',
        write_only=True
    )
    
    class Meta:
        model = CollegeProfile
        fields = [
            'id', 'user', 'user_id', 'college_name', 'college_code', 
            'address', 'contact_number', 'website', 'established_year',
            'principal_name', 'principal_email', 'total_students', 
            'total_faculty', 'created_at', 'updated_at'
        ]


class NGOSerializer(serializers.ModelSerializer):
    college_name = serializers.ReadOnlyField(source='college.college_name')
    
    class Meta:
        model = NGO
        fields = [
            'id', 'college', 'college_name', 'name', 'description', 
            'requirements', 'contact_person', 'contact_email', 
            'contact_phone', 'website', 'address', 'image',
            'created_at', 'updated_at', 'is_active'
        ]


class ProjectAssessmentSerializer(serializers.ModelSerializer):
    college_name = serializers.ReadOnlyField(source='college.college_name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    semester_display = serializers.CharField(source='get_target_semester_display', read_only=True)
    
    class Meta:
        model = ProjectAssessment
        fields = [
            'id', 'college', 'college_name', 'title', 'description',
            'target_semester', 'semester_display', 'target_branch',
            'start_date', 'end_date', 'status', 'status_display',
            'max_marks', 'assessment_criteria', 'resources',
            'submission_required', 'created_at', 'updated_at'
        ]


# Nested serializers for detailed views
class CollegeProfileDetailSerializer(CollegeProfileSerializer):
    ngos = NGOSerializer(many=True, read_only=True)
    project_assessments = ProjectAssessmentSerializer(many=True, read_only=True)
    
    class Meta(CollegeProfileSerializer.Meta):
        fields = CollegeProfileSerializer.Meta.fields + ['ngos', 'project_assessments']


class NGODetailSerializer(NGOSerializer):
    college = CollegeProfileSerializer(read_only=True)
    
    class Meta(NGOSerializer.Meta):
        fields = NGOSerializer.Meta.fields