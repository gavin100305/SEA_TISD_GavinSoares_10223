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
]