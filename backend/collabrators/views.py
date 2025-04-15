from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import CollaboratorProfile, ZoomMeeting
from students.models import Project, CollaborationRequest, ProjectComment

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
    """View all projects open for collaboration"""
    try:
        collaborator = request.user.collaborator_profile
        
        # Get all projects that are open for collaboration
        open_projects = Project.objects.filter(is_open_for_collaboration=True)
        
        # Get existing collaboration requests for this collaborator
        collaboration_requests = CollaborationRequest.objects.filter(collaborator=collaborator)
        request_status = {req.project_id: req.status for req in collaboration_requests}
        
        # Add request status to each project
        for project in open_projects:
            project.request_status = request_status.get(project.id)
            project.owner_name = project.group.name if project.group else project.student.full_name
            project.owner_type = 'Group' if project.group else 'Student'
        
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

@login_required
def schedule_meeting(request, project_id):
    try:
        collaborator = request.user.collaborator_profile
        project = get_object_or_404(Project, id=project_id)
        
        # Verify if collaborator is connected to this project
        if not CollaborationRequest.objects.filter(
            project=project,
            collaborator=collaborator,
            status='accepted'
        ).exists():
            messages.error(request, 'You are not connected to this project.')
            return redirect('collaborator_dashboard')
        
        if request.method == 'POST':
            meeting_title = request.POST.get('meeting_title')
            meeting_description = request.POST.get('meeting_description')
            scheduled_time = request.POST.get('scheduled_time')
            duration = request.POST.get('duration')
            zoom_link = request.POST.get('zoom_link')
            zoom_meeting_id = request.POST.get('zoom_meeting_id')
            zoom_password = request.POST.get('zoom_password')
            
            # Create the meeting
            meeting = ZoomMeeting.objects.create(
                collaborator=collaborator,
                student=project.student,
                project=project,
                meeting_title=meeting_title,
                meeting_description=meeting_description,
                scheduled_time=scheduled_time,
                duration=duration,
                zoom_link=zoom_link,
                zoom_meeting_id=zoom_meeting_id,
                zoom_password=zoom_password
            )
            
            messages.success(request, 'Meeting scheduled successfully!')
            return redirect('view_meetings', project_id=project_id)
            
        context = {
            'project': project
        }
        return render(request, 'collaborator/schedule_meeting.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')

@login_required
def view_meetings(request, project_id=None):
    try:
        collaborator = request.user.collaborator_profile
        
        if project_id:
            # View meetings for a specific project
            project = get_object_or_404(Project, id=project_id)
            # Verify if collaborator is connected to this project
            if not CollaborationRequest.objects.filter(
                project=project,
                collaborator=collaborator,
                status='accepted'
            ).exists():
                messages.error(request, 'You are not connected to this project.')
                return redirect('collaborator_dashboard')
                
            meetings = ZoomMeeting.objects.filter(
                collaborator=collaborator,
                project=project
            )
            context = {
                'project': project,
                'meetings': meetings
            }
            template = 'collaborator/project_meetings.html'
        else:
            # View all meetings
            meetings = ZoomMeeting.objects.filter(collaborator=collaborator)
            context = {'meetings': meetings}
            template = 'collaborator/all_meetings.html'
            
        return render(request, template, context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')

@login_required
def update_meeting(request, meeting_id):
    try:
        collaborator = request.user.collaborator_profile
        meeting = get_object_or_404(ZoomMeeting, id=meeting_id, collaborator=collaborator)
        
        if request.method == 'POST':
            meeting.meeting_title = request.POST.get('meeting_title')
            meeting.meeting_description = request.POST.get('meeting_description')
            meeting.scheduled_time = request.POST.get('scheduled_time')
            meeting.duration = request.POST.get('duration')
            meeting.zoom_link = request.POST.get('zoom_link')
            meeting.zoom_meeting_id = request.POST.get('zoom_meeting_id')
            meeting.zoom_password = request.POST.get('zoom_password')
            meeting.status = request.POST.get('status', 'scheduled')
            meeting.save()
            
            messages.success(request, 'Meeting updated successfully!')
            return redirect('view_meetings', project_id=meeting.project.id)
            
        context = {
            'meeting': meeting,
            'project': meeting.project
        }
        return render(request, 'collaborator/update_meeting.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')

@login_required
def add_project_comment(request, project_id):
    if request.method == 'POST':
        project = get_object_or_404(Project, id=project_id)
        collaborator = get_object_or_404(CollaboratorProfile, user=request.user)
        content = request.POST.get('content')
        parent_id = request.POST.get('parent_id')
        
        if not content:
            messages.error(request, 'Comment content cannot be empty.')
            return redirect('view_shared_projects')
        
        comment = ProjectComment(
            project=project,
            author_type='collaborator',
            author_id=collaborator.id,
            content=content
        )
        
        if parent_id:
            parent_comment = get_object_or_404(ProjectComment, id=parent_id)
            comment.parent_comment = parent_comment
        
        comment.save()
        messages.success(request, 'Comment added successfully!')
        return redirect('view_shared_projects')
    return redirect('view_shared_projects')

@login_required
def delete_project_comment(request, comment_id):
    comment = get_object_or_404(ProjectComment, id=comment_id)
    project_id = comment.project.id
    
    try:
        collaborator_profile = CollaboratorProfile.objects.get(user=request.user)
        is_author = comment.author_type == 'collaborator' and comment.author_id == collaborator_profile.id
        
        if is_author:
            comment.delete()
            messages.success(request, 'Comment deleted successfully.')
        else:
            messages.error(request, 'You do not have permission to delete this comment.')
            
    except CollaboratorProfile.DoesNotExist:
        messages.error(request, 'Collaborator profile not found.')
    
    return redirect('collaborator_view_project', project_id=project_id)

@login_required
def collaborator_view_project(request, project_id):
    """View project details and comments"""
    try:
        collaborator = request.user.collaborator_profile
        project = get_object_or_404(Project, id=project_id)
        
        # Get all comments for this project
        comments = project.comments.all().order_by('-created_at')
        
        context = {
            'project': project,
            'comments': comments,
        }
        return render(request, 'collaborator/project_detail.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')

@login_required
def collaborator_delete_comment(request, comment_id):
    comment = get_object_or_404(ProjectComment, id=comment_id)
    if comment.author_type == 'collaborator' and comment.author_id == request.user.collaborator_profile.id:
        comment.delete()
        messages.success(request, 'Comment deleted successfully!')
    else:
        messages.error(request, 'You do not have permission to delete this comment.')
    return redirect('view_shared_projects')

@login_required
def collaborator_add_comment(request, project_id):
    if request.method == 'POST':
        project = get_object_or_404(Project, id=project_id)
        collaborator = request.user.collaborator_profile
        content = request.POST.get('content')
        parent_id = request.POST.get('parent_id')
        
        if not content:
            messages.error(request, 'Comment content cannot be empty.')
            return redirect('view_shared_projects')
        
        comment = ProjectComment(
            project=project,
            author_type='collaborator',
            author_id=collaborator.id,
            content=content
        )
        
        if parent_id:
            parent_comment = get_object_or_404(ProjectComment, id=parent_id)
            comment.parent_comment = parent_comment
        
        comment.save()
        messages.success(request, 'Comment added successfully!')
        return redirect('view_shared_projects')
    return redirect('view_shared_projects')
