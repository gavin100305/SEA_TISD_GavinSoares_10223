from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User

# Create your views here.

def collaborator_signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        if password1 != password2:
            messages.error(request, 'Passwords do not match')
            return redirect('collaborator_signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return redirect('collaborator_signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return redirect('collaborator_signup')

        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)
        return redirect('collaborator_dashboard')

    return render(request, 'signup.html')

def collaborator_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('collaborator_dashboard')
        else:
            messages.error(request, 'Invalid username or password')
            return redirect('collaborator_login')

    return render(request, 'login.html')

def collaborator_logout(request):
    logout(request)
    return redirect('collaborator_login')

@login_required(login_url='collaborator_login')
def collaborator_dashboard(request):
    return render(request, 'dashboard.html')
