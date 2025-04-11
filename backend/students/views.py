from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import StudentProfile

# Create your views here.
def landing_page(request):
    return render(request, 'landing.html')

def student_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            try:
                profile = user.student_profile
                if profile.full_name and profile.roll_number:  # If profile is complete
                    messages.success(request, f'Welcome back, {profile.full_name}!')
                    return redirect('student_dashboard')
                messages.info(request, 'Please complete your profile.')
                return redirect('student_profile')
            except StudentProfile.DoesNotExist:
                # Create profile if it doesn't exist
                profile = StudentProfile.objects.create(user=user)
                messages.info(request, 'Please complete your profile.')
                return redirect('student_profile')
            except Exception as e:
                messages.error(request, f'An error occurred: {str(e)}')
                return redirect('student_login')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'student_login.html')

def student_signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'student_signup.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'student_signup.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return render(request, 'student_signup.html')

        # Create user and log them in
        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)
        messages.success(request, 'Account created successfully! Please complete your profile.')
        return redirect('student_profile')

    return render(request, 'student_signup.html')

@login_required
def student_profile(request):
    # Get or create student profile
    profile, created = StudentProfile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        # Update profile data
        profile.full_name = request.POST.get('full_name')
        profile.phone = request.POST.get('phone')
        profile.dob = request.POST.get('dob')
        profile.bio = request.POST.get('bio')
        
        # Handle profile picture upload
        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
        
        # Academic Information
        profile.roll_number = request.POST.get('roll_number')
        profile.branch = request.POST.get('branch')
        profile.section = request.POST.get('section')
        profile.semester = request.POST.get('semester')
        profile.admission_year = request.POST.get('admission_year')
        
        # Additional Information
        profile.address = request.POST.get('address')
        profile.parent_name = request.POST.get('parent_name')
        profile.parent_phone = request.POST.get('parent_phone')
        
        profile.save()
        
        messages.success(request, 'Profile updated successfully!')
        return redirect('student_dashboard')

    context = {
        'profile': profile
    }
    return render(request, 'student/student_profile.html', context)

@login_required
def student_dashboard(request):
    profile = request.user.student_profile
    context = {
        'profile': profile
    }
    return render(request, 'student/student_dashboard.html', context)

def student_logout(request):
    logout(request)
    return redirect('landing_page')


