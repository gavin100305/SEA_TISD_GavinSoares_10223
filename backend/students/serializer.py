from rest_framework import serializers
from django.contrib.auth.models import User
from .models import NGO, MentorProfile, Project
from college.models import CollegeProfile
from student.models import StudentProfile, StudentGroup

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CollegeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeProfile
        fields = '__all__'


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'


class StudentGroupSerializer(serializers.ModelSerializer):
    members = StudentProfileSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudentGroup
        fields = '__all__'


class NGOSerializer(serializers.ModelSerializer):
    college = CollegeProfileSerializer(read_only=True)
    
    class Meta:
        model = NGO
        fields = '__all__'


class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    college = CollegeProfileSerializer(read_only=True)
    
    class Meta:
        model = MentorProfile
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)
    group = StudentGroupSerializer(read_only=True)
    mentor = MentorProfileSerializer(read_only=True)
    college = CollegeProfileSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'


class ProjectDetailSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)
    group = StudentGroupSerializer(read_only=True)
    mentor = MentorProfileSerializer(read_only=True)
    college = CollegeProfileSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'