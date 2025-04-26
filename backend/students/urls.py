from django.urls import path
from django.contrib.auth.views import LogoutView
from students import views

urlpatterns = [
    path('', views.landing_page, name='landing_page'),
    path('login/', views.student_login, name='student_login'),
    path('signup/', views.student_signup, name='student_signup'),
    path('profile/', views.student_profile, name='student_profile'),
    path('dashboard/', views.student_dashboard, name='dashboard'),
    path('logout/', LogoutView.as_view(next_page='landing_page'), name='logout'),
    path('logout/', views.student_logout, name='student_logout'),
    path('mentors/', views.list_mentors, name='list_mentors'),
    path('mentors/<int:mentor_id>/connect/', views.send_connection_request, name='send_connection_request'),
    path('connections/', views.my_connections, name='my_connections'),
    path('projects/', views.my_projects, name='my_projects'),
    path('projects/add/', views.add_project, name='add_project'),
    path('projects/<int:project_id>/edit/', views.edit_project, name='edit_project'),
    path('projects/<int:project_id>/delete/', views.delete_project, name='delete_project'),
    path('projects/<int:project_id>/share/', views.share_project, name='share_project'),
    path('projects/<int:project_id>/toggle-collaboration/', views.toggle_project_collaboration, name='toggle_project_collaboration'),
    path('collaboration-requests/', views.view_collaboration_requests, name='view_collaboration_requests'),
    path('collaboration-requests/<int:request_id>/handle/', views.handle_collaboration_request, name='handle_collaboration_request'),
    path('projects/<int:project_id>/comments/', views.view_project_comments, name='view_project_comments'),

    path('projects/<int:project_id>/', views.project_detail, name='project_detail'),


    path('ngos/', views.ngo_list, name='ngos_list'),
    path('ngos/<int:ngo_id>/', views.ngo_detail, name='ngos_detail'),
    
    # Group URLs
    path('groups/', views.my_groups, name='my_groups'),
    path('groups/create/', views.create_group, name='create_group'),
    path('groups/<int:group_id>/', views.group_detail, name='group_detail'),
    path('groups/<int:group_id>/invite/', views.invite_member, name='invite_member'),
    path('groups/invitation/<int:membership_id>/', views.handle_invitation, name='handle_invitation'),
    path('groups/<int:group_id>/remove/<int:member_id>/', views.remove_member, name='remove_member'),
    path('groups/<int:group_id>/add-project/', views.add_group_project, name='add_group_project'),

    path('groups/<int:group_id>/projects/<int:project_id>/edit/', views.edit_group_project, name='edit_group_project'),

    path('groups/<int:group_id>/projects/<int:project_id>/delete/', views.delete_group_project, name='delete_group_project'),

    path('groups/<int:group_id>/projects/<int:project_id>/', views.group_project_detail, name='group_project_detail'),


    # Add new URL patterns for meetings
    path('my-meetings/', views.student_meetings, name='student_meetings'),
    path('meeting/<int:meeting_id>/', views.meeting_detail, name='student_meeting_detail'),
    # path('meetings/', views.student_meetings, name='student_meetings'),
    path('view-collaborators/', views.view_collaborators, name='view_collaborators'),
    path('schedule-meeting/<int:project_id>/<int:collaborator_id>/', views.schedule_meeting, name='student_schedule_meeting'),
    path('meetings/', views.view_meetings, name='student_all_meetings'),
    path('meetings/project/<int:project_id>/', views.view_meetings, name='student_view_meetings'),
    path('meeting/update/<int:meeting_id>/', views.update_meeting, name='student_update_meeting'),
    path('project/<int:project_id>/comment/', views.add_project_comment, name='add_project_comment'),
    path('comment/<int:comment_id>/delete/', views.delete_project_comment, name='delete_project_comment'),
    path('assessments/', views.view_assessments, name='student_view_assessments'),
    path('assessments/<int:assessment_id>/', views.assessment_detail, name='student_assessment_detail'),

]