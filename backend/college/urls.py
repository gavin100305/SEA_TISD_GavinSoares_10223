from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.college_login, name='college_login'),
    path('signup/', views.college_signup, name='college_signup'),
    path('logout/', views.college_logout, name='college_logout'),
    path('profile/', views.college_profile, name='college_profile'),
    path('dashboard/', views.college_dashboard, name='college_dashboard'),
    path('mentor-requests/', views.mentor_requests, name='mentor_requests'),
    path('verify_mentor/<int:mentor_id>/', views.verify_mentor, name='verify_mentor'),

    path('college/ngos/', views.ngo_list, name='ngo_list'),
    path('college/ngos/add/', views.add_ngo, name='add_ngo'),
    path('college/ngos/edit/<int:ngo_id>/', views.edit_ngo, name='edit_ngo'),
    path('college/ngos/delete/<int:ngo_id>/', views.delete_ngo, name='delete_ngo'),

]
