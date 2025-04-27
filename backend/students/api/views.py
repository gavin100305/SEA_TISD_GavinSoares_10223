# students/api/views.py
from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from students.models import Project
from students.api.serializers import MentorProfileSerializer, ProjectSerializer, NGOSerializer
from mentor.models import MentorProfile
from college.models import NGO
from collections import Counter
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import TruncMonth

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

class ProjectChartDataAPIView(generics.GenericAPIView):
    def get(self, request):
        try:
            chart_type = request.GET.get('chart_type', 'sdgs')
            projects = Project.objects.all()
            
            if chart_type == 'sdgs':
                # Count SDGs frequency
                sdg_data = []
                for project in projects:
                    sdg_data.extend([sdg.strip() for sdg in project.sdgs.split(',') if sdg.strip()])
                sdg_counts = Counter(sdg_data)
                
                data = {
                    'labels': list(sdg_counts.keys()),
                    'datasets': [{
                        'label': 'SDGs Distribution',
                        'data': list(sdg_counts.values())
                    }]
                }
                
            elif chart_type == 'tech_stack':
                # Tech stack distribution
                tech_data = []
                for project in projects:
                    tech_data.extend([tech.strip() for tech in project.tech_stack.split(',') if tech.strip()])
                tech_counts = Counter(tech_data)
                
                data = {
                    'labels': list(tech_counts.keys()),
                    'datasets': [{
                        'label': 'Technologies Used',
                        'data': list(tech_counts.values())
                    }]
                }
                
            elif chart_type == 'status':
                # Project status distribution
                status_counts = projects.values('status').annotate(count=Count('id'))
                status_dict = {item['status']: item['count'] for item in status_counts}
                
                data = {
                    'labels': ['Completed', 'In Progress', 'Under Review'],
                    'datasets': [{
                        'label': 'Project Status',
                        'data': [
                            status_dict.get('completed', 0),
                            status_dict.get('in_progress', 0),
                            status_dict.get('under_review', 0)
                        ]
                    }]
                }
                
            elif chart_type == 'timeline':
                # Projects created over time
                monthly_data = (
                    projects
                    .annotate(month=TruncMonth('created_at'))
                    .values('month')
                    .annotate(count=Count('id'))
                    .order_by('month')
                )
                
                data = {
                    'labels': [item['month'].strftime('%b %Y') for item in monthly_data],
                    'datasets': [{
                        'label': 'Projects Created',
                        'data': [item['count'] for item in monthly_data]
                    }]
                }
                
            else:
                data = {'error': 'Invalid chart type'}
            
            return Response(data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)