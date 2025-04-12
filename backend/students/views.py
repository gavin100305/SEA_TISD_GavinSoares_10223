from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import StudentProfile, MentorConnection, Project
from mentor.models import MentorProfile
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from college.models import CollegeProfile,NGO
from django.db.models import Q



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

@login_required
def list_mentors(request):
    # Get all approved mentors
    mentors = MentorProfile.objects.filter(verification_status='approved')
    
    # Get current student's connections
    student = request.user.student_profile
    connections = MentorConnection.objects.filter(student=student)
    
    # Create a list of mentors with their connection status
    mentors_with_status = []
    for mentor in mentors:
        connection = connections.filter(mentor=mentor).first()
        status = connection.status if connection else None
        mentors_with_status.append({
            'mentor': mentor,
            'connection_status': status
        })
    
    context = {
        'mentors': mentors_with_status
    }
    return render(request, 'student/list_mentors.html', context)

@login_required
def send_connection_request(request, mentor_id):
    if request.method == 'POST':
        mentor = get_object_or_404(MentorProfile, id=mentor_id, verification_status='approved')
        student = request.user.student_profile
        message = request.POST.get('message', '')

        # Check if connection already exists
        connection, created = MentorConnection.objects.get_or_create(
            student=student,
            mentor=mentor,
            defaults={'message': message}
        )

        if created:
            messages.success(request, f'Connection request sent to {mentor.full_name}')
        else:
            messages.info(request, f'You already have a {connection.status} connection with {mentor.full_name}')

    return redirect('list_mentors')

@login_required
def my_connections(request):
    student = request.user.student_profile
    connections = MentorConnection.objects.filter(student=student)
    return render(request, 'student/my_connections.html', {'connections': connections})

@login_required
def my_projects(request):
    try:
        student = request.user.student_profile
        projects = Project.objects.filter(student=student)
        connected_mentors = MentorProfile.objects.filter(
            student_connections__student=student,
            student_connections__status='accepted'
        )
        
        context = {
            'projects': projects,
            'connected_mentors': connected_mentors,
        }
        return render(request, 'student/my_projects.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('student_dashboard')

@login_required
def add_project(request):
    student = request.user.student_profile
    
    # Get connected mentors
    connected_mentors = MentorConnection.objects.filter(
        student=student,
        status='accepted'
    ).select_related('mentor')
    
    if request.method == 'POST':
        try:
            mentor_id = request.POST.get('mentor')
            mentor = MentorProfile.objects.get(id=mentor_id)
            
            # Verify mentor connection
            if not MentorConnection.objects.filter(
                student=student,
                mentor=mentor,
                status='accepted'
            ).exists():
                messages.error(request, 'You can only share projects with connected mentors.')
                return redirect('my_projects')
            
            # Create project
            project = Project.objects.create(
                student=student,
                mentor=mentor,
                title=request.POST.get('title'),
                description=request.POST.get('description'),
                sdgs=request.POST.get('sdgs'),
                tech_stack=request.POST.get('tech_stack'),
                github_link=request.POST.get('github_link')
            )
            
            # Handle project file
            if 'project_file' in request.FILES:
                project.project_file = request.FILES['project_file']
                project.save()
            
            messages.success(request, 'Project added successfully!')
            return redirect('my_projects')
            
        except Exception as e:
            messages.error(request, f'An error occurred: {str(e)}')
            return redirect('my_projects')
    
    context = {
        'connected_mentors': connected_mentors
    }
    return render(request, 'student/add_project.html', context)

@login_required
def edit_project(request, project_id):
    student = request.user.student_profile
    project = get_object_or_404(Project, id=project_id, student=student)
    
    # Get connected mentors
    connected_mentors = MentorConnection.objects.filter(
        student=student,
        status='accepted'
    ).select_related('mentor')
    
    if request.method == 'POST':
        try:
            mentor_id = request.POST.get('mentor')
            mentor = MentorProfile.objects.get(id=mentor_id)
            
            # Verify mentor connection
            if not MentorConnection.objects.filter(
                student=student,
                mentor=mentor,
                status='accepted'
            ).exists():
                messages.error(request, 'You can only share projects with connected mentors.')
                return redirect('my_projects')
            
            # Update project
            project.mentor = mentor
            project.title = request.POST.get('title')
            project.description = request.POST.get('description')
            project.sdgs = request.POST.get('sdgs')
            project.tech_stack = request.POST.get('tech_stack')
            project.github_link = request.POST.get('github_link')
            project.status = request.POST.get('status', 'in_progress')
            
            # Handle project file
            if 'project_file' in request.FILES:
                project.project_file = request.FILES['project_file']
            
            project.save()
            messages.success(request, 'Project updated successfully!')
            return redirect('my_projects')
            
        except Exception as e:
            messages.error(request, f'An error occurred: {str(e)}')
    
    context = {
        'project': project,
        'connected_mentors': connected_mentors
    }
    return render(request, 'student/edit_project.html', context)

@login_required
def delete_project(request, project_id):
    if request.method == 'POST':
        student = request.user.student_profile
        project = get_object_or_404(Project, id=project_id, student=student)
        project.delete()
        messages.success(request, 'Project deleted successfully!')
    return redirect('my_projects')

@login_required
def share_project(request, project_id):
    if request.method != 'POST':
        return redirect('my_projects')
        
    try:
        student = request.user.student_profile
        project = get_object_or_404(Project, id=project_id, student=student)
        
        # Check if project is already shared
        if project.mentor or project.college or project.collaborator:
            messages.error(request, 'This project is already shared.')
            return redirect('my_projects')
        
        share_with = request.POST.get('share_with', '')
        
        if share_with.startswith('mentor_'):
            mentor_id = share_with.split('_')[1]
            mentor = get_object_or_404(MentorProfile, id=mentor_id)
            
            # Verify connection exists
            connection = MentorConnection.objects.filter(
                student=student,
                mentor=mentor,
                status='accepted'
            ).exists()
            
            if not connection:
                messages.error(request, 'You can only share projects with connected mentors.')
                return redirect('my_projects')
                
            project.mentor = mentor
            messages.success(request, f'Project shared with mentor {mentor.full_name}.')
            
        elif share_with == 'college':
            project.college = student.college
            messages.success(request, 'Project shared with college.')
            
        elif share_with == 'collaborator':
            project.collaborator = True
            messages.success(request, 'Project shared with collaborators.')
            
        else:
            messages.error(request, 'Invalid sharing option selected.')
            return redirect('my_projects')
            
        project.save()
        return redirect('my_projects')
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('my_projects')


def ngo_list(request):
    """Display a list of active NGOs to students"""
    # Get all active NGOs
    ngos = NGO.objects.filter(is_active=True).order_by('name')
    

    # Pagination
    page = request.GET.get('page', 1)
    paginator = Paginator(ngos, 10)  # Show 10 NGOs per page
    
    try:
        ngo_list = paginator.page(page)
    except PageNotAnInteger:
        ngo_list = paginator.page(1)
    except EmptyPage:
        ngo_list = paginator.page(paginator.num_pages)
    
    context = {
        'ngo_list': ngo_list,
    }
    
    return render(request, 'student/ngo_list.html', context)


def ngo_detail(request, ngo_id):
    """Display detailed information about a specific NGO"""
    ngo = get_object_or_404(NGO, id=ngo_id, is_active=True)
    
    context = {
        'ngo': ngo,
    }
    
    return render(request, 'student/ngo_detail.html', context)




