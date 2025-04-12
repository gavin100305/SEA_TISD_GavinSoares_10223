from django.urls import path
from collabrators import views

urlpatterns = [
    path('login/', views.collaborator_login, name='collaborator_login'),
    path('signup/', views.collaborator_signup, name='collaborator_signup'),
    path('logout/', views.collaborator_logout, name='collaborator_logout'),
    path('dashboard/', views.collaborator_dashboard, name='collaborator_dashboard'),
]