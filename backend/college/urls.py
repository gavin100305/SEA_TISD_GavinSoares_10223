from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.college_login, name='college_login'),
    path('signup/', views.college_signup, name='college_signup'),
    path('logout/', views.college_logout, name='college_logout'),
    path('profile/', views.college_profile, name='college_profile'),
    path('dashboard/', views.college_dashboard, name='college_dashboard'),
    path('mentors/', views.registered_mentors, name='registered_mentors'),
    path('students/', views.registered_students, name='registered_students'),
    path('mentor-requests/', views.mentor_requests, name='mentor_requests'),
    path('verify_mentor/<int:mentor_id>/', views.verify_mentor, name='verify_mentor'),

    path('ngos/', views.ngo_list, name='ngo_list'),
    path('ngos/add/', views.add_ngo, name='add_ngo'),
    path('ngos/edit/<int:ngo_id>/', views.edit_ngo, name='edit_ngo'),
    path('ngos/delete/<int:ngo_id>/', views.delete_ngo, name='delete_ngo'),

    path('view-collaborators/', views.view_collaborators, name='college_view_collaborators'),

    path('project-assessments/', views.project_assessment_list, name='project_assessment_list'),
    path('project-assessments/add/', views.add_project_assessment, name='add_project_assessment'),
    path('project-assessments/edit/<int:assessment_id>/', views.edit_project_assessment, name='edit_project_assessment'),
    path('project-assessments/delete/<int:assessment_id>/', views.delete_project_assessment, name='delete_project_assessment'),

    path('project-statistics/', views.project_statistics, name='project_statistics'),
    path('api/project-charts-data/', views.project_charts_data, name='project_charts_data'),
    path('ngo/<int:ngo_id>/', views.ngo_detail, name='ngo_detail'),

]
