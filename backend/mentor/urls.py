from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.mentor_login, name='mentor_login'),
    path('signup/', views.mentor_signup, name='mentor_signup'),
    path('logout/', views.mentor_logout, name='mentor_logout'),
    path('profile/', views.mentor_profile, name='mentor_profile'),
    path('dashboard/', views.mentor_dashboard, name='mentor_dashboard'),
    path('students/', views.list_students, name='list_students'),
    path('connections/', views.connection_requests, name='connection_requests'),
    
    path('connections/<int:connection_id>/<str:action>/', views.handle_connection_request, name='handle_connection_request'),
    path('connected-students/', views.connected_students, name='connected_students'),
    path('projects/', views.mentor_projects, name='mentor_projects'),
    path('projects/<int:project_id>/review/', views.review_project, name='review_project'),
    path('schedule-meeting/<int:student_id>/', views.schedule_meeting, name='schedule_meeting'),
    path('meetings/', views.meeting_list, name='meeting_list'),
    path('meeting/<int:meeting_id>/', views.meeting_detail, name='meeting_detail'),
    path('meeting/<int:meeting_id>/cancel/', views.cancel_meeting, name='cancel_meeting'),
]