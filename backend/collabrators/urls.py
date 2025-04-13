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
]