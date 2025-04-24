# students/api/views.py
from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from students.models import Project
from students.api.serializers import MentorProfileSerializer, ProjectSerializer, NGOSerializer
from mentor.models import MentorProfile
from college.models import NGO

class MentorProfileListAPIView(generics.ListAPIView):
    queryset = MentorProfile.objects.filter(verification_status='approved')
    serializer_class = MentorProfileSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['college', 'specialization', 'teaching_branch']
    search_fields = ['full_name', 'specialization', 'expertise_areas']
    ordering_fields = ['full_name', 'experience_years', 'created_at']

class MentorProfileDetailAPIView(generics.RetrieveAPIView):
    queryset = MentorProfile.objects.filter(verification_status='approved')
    serializer_class = MentorProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

class ProjectListAPIView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['college', 'status', 'mentor']
    search_fields = ['title', 'description', 'sdgs', 'tech_stack']
    ordering_fields = ['title', 'created_at', 'updated_at']
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ProjectDetailAPIView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class NGOListAPIView(generics.ListAPIView):
    queryset = NGO.objects.filter(is_active=True)
    serializer_class = NGOSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['college']
    search_fields = ['name', 'description', 'requirements']
    ordering_fields = ['name', 'created_at']
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class NGODetailAPIView(generics.RetrieveAPIView):
    queryset = NGO.objects.filter(is_active=True)
    serializer_class = NGOSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context