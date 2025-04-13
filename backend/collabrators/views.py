from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import CollaboratorProfile
from students.models import Project, CollaborationRequest

# Create your views here.

def collaborator_signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'collaborator/collaborator_signup.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'collaborator/collaborator_signup.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return render(request, 'collaborator/collaborator_signup.html')

        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)
        CollaboratorProfile.objects.create(user=user)
        messages.success(request, 'Account created successfully! Please complete your profile.')
        return redirect('collaborator_profile')

    return render(request, 'collaborator/collaborator_signup.html')

def collaborator_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            try:
                profile = user.collaborator_profile
                if profile.is_profile_complete:
                    messages.success(request, f'Welcome back, {profile.full_name}!')
                    return redirect('collaborator_dashboard')
                messages.info(request, 'Please complete your profile.')
                return redirect('collaborator_profile')
            except CollaboratorProfile.DoesNotExist:
                profile = CollaboratorProfile.objects.create(user=user)
                messages.info(request, 'Please complete your profile.')
                return redirect('collaborator_profile')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'collaborator/collaborator_login.html')

def collaborator_logout(request):
    logout(request)
    return redirect('landing_page')

@login_required
def collaborator_profile(request):
    profile, created = CollaboratorProfile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        # Update profile data
        profile.full_name = request.POST.get('full_name', '').strip()
        profile.expertise = request.POST.get('expertise', '').strip()
        profile.company = request.POST.get('company', '').strip()
        profile.position = request.POST.get('position', '').strip()
        
        try:
            profile.experience_years = int(request.POST.get('experience_years', '0'))
        except ValueError:
            profile.experience_years = 0
            
        profile.linkedin_url = request.POST.get('linkedin_url', '').strip()
        profile.github_url = request.POST.get('github_url', '').strip()
        profile.portfolio_url = request.POST.get('portfolio_url', '').strip()
        profile.bio = request.POST.get('bio', '').strip() or None  # Convert empty string to None
        profile.phone = request.POST.get('phone', '').strip()
        
        # Handle profile picture upload
        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
        
        # Save will automatically check if profile is complete
        profile.save()
        
        if profile.is_profile_complete:
            messages.success(request, 'Profile updated successfully!')
            return redirect('collaborator_dashboard')
        else:
            messages.warning(request, 'Please fill in all required fields (Full Name, Expertise, Position, and Bio) to complete your profile.')

    context = {
        'profile': profile
    }
    return render(request, 'collaborator/collaborator_profile.html', context)

@login_required
def collaborator_dashboard(request):
    profile = request.user.collaborator_profile
    context = {
        'profile': profile
    }
    return render(request, 'collaborator/collaborator_dashboard.html', context)

@login_required
def view_shared_projects(request):
    """View all projects that are open for collaboration"""
    try:
        collaborator = request.user.collaborator_profile
        
        # Get all projects that are open for collaboration
        open_projects = Project.objects.filter(is_open_for_collaboration=True)
        
        # Get the collaboration requests made by this collaborator
        collaboration_requests = CollaborationRequest.objects.filter(
            collaborator=collaborator
        ).values_list('project_id', 'status')
        
        # Create a dictionary of project_id: request_status
        request_status = {proj_id: status for proj_id, status in collaboration_requests}
        
        # Add request status to each project
        for project in open_projects:
            project.request_status = request_status.get(project.id, None)
            if project.group:
                project.owner_name = project.group.name
                project.owner_type = 'Group'
            else:
                project.owner_name = project.student.full_name
                project.owner_type = 'Individual'
        
        context = {
            'projects': open_projects,
        }
        return render(request, 'collaborator/shared_projects.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')

@login_required
def send_collaboration_request(request, project_id):
    """Send a collaboration request for a project"""
    if request.method == 'POST':
        try:
            collaborator = request.user.collaborator_profile
            project = get_object_or_404(Project, id=project_id, is_open_for_collaboration=True)
            
            # Check if a request already exists
            existing_request = CollaborationRequest.objects.filter(
                project=project,
                collaborator=collaborator
            ).first()
            
            if existing_request:
                if existing_request.status == 'withdrawn':
                    # If the previous request was withdrawn, update it
                    existing_request.status = 'pending'
                    existing_request.message = request.POST.get('message', '')
                    existing_request.proposed_contribution = request.POST.get('proposed_contribution', '')
                    existing_request.save()
                    messages.success(request, 'Your collaboration request has been renewed.')
                else:
                    messages.error(request, 'You have already sent a request for this project.')
            else:
                # Create new request
                CollaborationRequest.objects.create(
                    project=project,
                    collaborator=collaborator,
                    message=request.POST.get('message', ''),
                    proposed_contribution=request.POST.get('proposed_contribution', '')
                )
                messages.success(request, 'Your collaboration request has been sent.')
            
            return redirect('view_shared_projects')
            
        except Exception as e:
            messages.error(request, f'An error occurred: {str(e)}')
            return redirect('view_shared_projects')
    
    return redirect('view_shared_projects')
