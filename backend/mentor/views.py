from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import MentorProfile
from college.models import CollegeProfile

def mentor_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            try:
                mentor = MentorProfile.objects.get(user=user)
                if mentor.verification_status == 'pending':
                    messages.info(request, 'Your application is under review. Please wait for college verification.')
                    return redirect('mentor_dashboard')
                elif mentor.verification_status == 'rejected':
                    messages.error(request, 'Your application has been rejected by the college.')
                    return redirect('mentor_dashboard')
                elif mentor.verification_status == 'approved':
                    # Check if profile is complete
                    if all([mentor.full_name, mentor.highest_qualification, mentor.specialization]):
                        messages.success(request, f'Welcome back, {mentor.full_name}!')
                        return redirect('mentor_dashboard')
                    else:
                        messages.info(request, 'Please complete your profile.')
                        return redirect('mentor_profile')
            except MentorProfile.DoesNotExist:
                messages.error(request, 'Mentor profile not found.')
                return redirect('mentor_signup')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'mentor_login.html')

def mentor_signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'mentor_signup.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'mentor_signup.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return render(request, 'mentor_signup.html')

        try:
            # Get the first college (since there's only one)
            college = CollegeProfile.objects.first()
            if not college:
                messages.error(request, 'College profile not found. Please contact administrator.')
                return render(request, 'mentor_signup.html')
            
            # Create user and mentor profile
            user = User.objects.create_user(username=username, email=email, password=password1)
            mentor = MentorProfile.objects.create(
                user=user,
                verification_status='pending',
                college=college
            )
            
            login(request, user)
            messages.info(request, f'Account created successfully! Your application is under review.')
            return redirect('mentor_dashboard')
            
        except Exception as e:
            if 'user' in locals():
                user.delete()
            messages.error(request, 'An error occurred during signup. Please try again.')
            return render(request, 'mentor_signup.html')

    return render(request, 'mentor_signup.html')

@login_required
def mentor_profile(request):
    try:
        mentor = request.user.mentor_profile
        
        # Redirect if not approved
        if mentor.verification_status != 'approved':
            messages.error(request, 'You need to be approved by the college before completing your profile.')
            return redirect('mentor_dashboard')

        # Handle profile update
        if request.method == 'POST':
            mentor.full_name = request.POST.get('full_name')
            mentor.phone = request.POST.get('phone')
            mentor.highest_qualification = request.POST.get('highest_qualification')
            mentor.university = request.POST.get('university')
            mentor.specialization = request.POST.get('specialization')
            mentor.current_role = request.POST.get('current_role')
            mentor.experience_years = request.POST.get('experience_years')
            mentor.teaching_branch = request.POST.get('teaching_branch')
            mentor.expertise_areas = request.POST.get('expertise_areas')
            mentor.bio = request.POST.get('bio')
            mentor.linkedin = request.POST.get('linkedin')
            mentor.website = request.POST.get('website')

            if 'profile_picture' in request.FILES:
                mentor.profile_picture = request.FILES['profile_picture']

            mentor.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('mentor_dashboard')

        update_mode = request.GET.get('mode') == 'update'
        context = {
            'mentor': mentor,
            'update_mode': update_mode
        }
        return render(request, 'mentor_profile.html', context)

    except MentorProfile.DoesNotExist:
        messages.error(request, 'Mentor profile not found.')
        return redirect('mentor_login')

@login_required
def mentor_dashboard(request):
    try:
        mentor = request.user.mentor_profile
        context = {
            'mentor': mentor,
            'verification_status': mentor.get_verification_status_display()
        }
        return render(request, 'mentor_dashboard.html', context)
    except MentorProfile.DoesNotExist:
        messages.error(request, 'Mentor profile not found.')
        return redirect('mentor_login')

@login_required
def mentor_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('landing')
