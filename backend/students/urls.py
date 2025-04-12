from django.urls import path
from django.contrib.auth.views import LogoutView
from students import views

urlpatterns = [
    path('', views.landing_page, name='landing_page'),
    path('login/', views.student_login, name='student_login'),
    path('signup/', views.student_signup, name='student_signup'),
    path('profile/', views.student_profile, name='student_profile'),
    path('dashboard/', views.student_dashboard, name='student_dashboard'),
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

    path('ngos/', views.ngo_list, name='ngo_list'),
    path('ngos/<int:ngo_id>/', views.ngo_detail, name='ngo_detail'),
    

]