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
]