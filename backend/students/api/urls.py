# students/api/urls.py
from django.urls import path
from students.api.views import (
    MentorProfileListAPIView, MentorProfileDetailAPIView,
    ProjectListAPIView, ProjectDetailAPIView,
    NGOListAPIView, NGODetailAPIView
)

urlpatterns = [
    # Mentor API URLs
    path('mentors/', MentorProfileListAPIView.as_view(), name='api-mentor-list'),
    path('mentors/<int:id>/', MentorProfileDetailAPIView.as_view(), name='api-mentor-detail'),
    
    # Project API URLs
    path('projects/', ProjectListAPIView.as_view(), name='api-project-list'),
    path('projects/<int:id>/', ProjectDetailAPIView.as_view(), name='api-project-detail'),
    
    # NGO API URLs
    path('ngos/', NGOListAPIView.as_view(), name='api-ngo-list'),
    path('ngos/<int:id>/', NGODetailAPIView.as_view(), name='api-ngo-detail'),
]