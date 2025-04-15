from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.collaborator_login, name='collaborator_login'),
    path('signup/', views.collaborator_signup, name='collaborator_signup'),
    path('logout/', views.collaborator_logout, name='collaborator_logout'),
    path('dashboard/', views.collaborator_dashboard, name='collaborator_dashboard'),
    path('profile/', views.collaborator_profile, name='collaborator_profile'),
    path('shared-projects/', views.view_shared_projects, name='view_shared_projects'),
    path('send-collaboration-request/<int:project_id>/', views.send_collaboration_request, name='send_collaboration_request'),
    path('schedule-meeting/<int:project_id>/', views.schedule_meeting, name='schedule_meeting'),
    path('meetings/', views.view_meetings, name='all_meetings'),
    path('meetings/project/<int:project_id>/', views.view_meetings, name='view_meetings'),
    path('meeting/update/<int:meeting_id>/', views.update_meeting, name='update_meeting'),
    path('project/<int:project_id>/', views.collaborator_view_project, name='collaborator_view_project'),
    path('project/<int:project_id>/comment/', views.collaborator_add_comment, name='collaborator_add_comment'),
    path('comment/<int:comment_id>/delete/', views.collaborator_delete_comment, name='collaborator_delete_comment'),
]