from django.urls import path
from . import views

urlpatterns = [
    path('college_login/', views.college_login, name='college_login'),
    path('college_signup/', views.college_signup, name='college_signup'),
    path('college_logout/', views.college_logout, name='college_logout'),
    path('college_profile/', views.college_profile, name='college_profile'),
    path('college_dashboard/', views.college_dashboard, name='college_dashboard'),
    path('verify_mentor/<int:mentor_id>/', views.verify_mentor, name='verify_mentor'),
]
