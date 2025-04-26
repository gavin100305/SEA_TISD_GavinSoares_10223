from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import CollaboratorProfile, CollabZoomMeeting
from students.models import Project, CollaborationRequest, ProjectComment
from .util import generate_gemini_recommendations
from django.utils import timezone

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
        profile.full_name = request.POST.get('full_name', '').strip() or None
        profile.expertise = request.POST.get('expertise', '').strip() or None
        profile.company = request.POST.get('company', '').strip() or None
        profile.position = request.POST.get('position', '').strip() or None
        
        try:
            profile.experience_years = int(request.POST.get('experience_years', '0'))
        except ValueError:
            profile.experience_years = 0
            
        profile.linkedin_url = request.POST.get('linkedin_url', '').strip() or None
        profile.github_url = request.POST.get('github_url', '').strip() or None
        profile.portfolio_url = request.POST.get('portfolio_url', '').strip() or None
        profile.bio = request.POST.get('bio', '').strip() or None
        profile.phone = request.POST.get('phone', '').strip() or None
        
        # Handle profile picture upload
        if 'profile_picture' in request.FILES:
            # Delete old picture if it exists
            if profile.profile_picture:
                profile.profile_picture.delete(save=False)
            profile.profile_picture = request.FILES['profile_picture']
        # Handle profile picture removal if checkbox is checked
        elif request.POST.get('profile_picture-clear') == 'on':
            if profile.profile_picture:
                profile.profile_picture.delete(save=False)
            profile.profile_picture = None
        
        profile.save()
        
        if profile.is_profile_complete:
            messages.success(request, 'Profile updated successfully!')
            return redirect('collaborator_dashboard')
        else:
            # Find which required fields are missing
            missing_fields = []
            if not profile.full_name:
                missing_fields.append("Full Name")
            if not profile.expertise:
                missing_fields.append("Areas of Expertise")
            if not profile.position:
                missing_fields.append("Position")
            if not profile.bio:
                missing_fields.append("Professional Bio")
            
            messages.warning(
                request, 
                f'Please fill in all required fields to complete your profile. Missing: {", ".join(missing_fields)}'
            )
            return redirect('collaborator_profile')

    # Get the profile picture URL safely
    try:
        profile_picture_url = profile.profile_picture.url if profile.profile_picture else None
    except ValueError:
        profile_picture_url = None

    context = {
        'profile': profile,
        'profile_picture_url': profile_picture_url
    }
    return render(request, 'collaborator/collaborator_profile.html', context)

@login_required
def collaborator_dashboard(request):
    profile = request.user.collaborator_profile
    
    # Get active projects (projects with accepted collaboration requests)
    active_projects = CollaborationRequest.objects.filter(
        collaborator=profile,
        status='accepted'
    ).count()
    
    # Get team members (distinct students/groups the collaborator is working with)
    team_members_count = 0
    collab_requests = CollaborationRequest.objects.filter(
        collaborator=profile,
        status='accepted'
    )
    
    # Count unique students and groups
    unique_students = set()
    unique_groups = set()
    
    for collab in collab_requests:
        project = collab.project
        if project.student:
            unique_students.add(project.student.id)
        elif project.group:
            unique_groups.add(project.group.id)
    
    team_members_count = len(unique_students) + len(unique_groups)
    
    # Get scheduled meetings (active tasks)
    upcoming_meetings = CollabZoomMeeting.objects.filter(
        collaborator=profile,
        status='scheduled',
        scheduled_time__gte=timezone.now()
    ).count()
    
    # Get recent collaboration requests
    recent_requests = CollaborationRequest.objects.filter(
        collaborator=profile
    ).order_by('-created_at')[:5]
    
    # Get upcoming meetings
    upcoming_meetings_list = CollabZoomMeeting.objects.filter(
        collaborator=profile,
        status='scheduled',
        scheduled_time__gte=timezone.now()
    ).order_by('scheduled_time')[:5]
    
    context = {
        'profile': profile,
        'active_projects': active_projects,
        'team_members_count': team_members_count,
        'upcoming_meetings': upcoming_meetings,
        'recent_requests': recent_requests,
        'upcoming_meetings_list': upcoming_meetings_list
    }
    
    return render(request, 'collaborator/collaborator_dashboard.html', context)

@login_required
def view_shared_projects(request):
    """View all projects open for collaboration with intelligent recommendation functionality"""
    try:
        collaborator = request.user.collaborator_profile
        projects = Project.objects.filter(is_open_for_collaboration=True)
        
        # Handle search filters
        search_query = request.GET.get('search', '')
        tech_stack = request.GET.get('tech_stack', '')
        sdgs = request.GET.get('sdgs', '')
        status = request.GET.get('status', '')
        recommend = request.GET.get('recommend', '')
        
        # Apply regular filters if provided
        if search_query:
            projects = projects.filter(title__icontains=search_query)
        
        if tech_stack:
            projects = projects.filter(tech_stack__icontains=tech_stack)
            
        if sdgs:
            projects = projects.filter(sdgs__icontains=sdgs)
            
        if status:
            projects = projects.filter(status=status)
        
        collaborator = request.user.collaborator_profile
        # Get existing collaboration requests for this collaborator
        collaboration_requests = CollaborationRequest.objects.filter(collaborator=collaborator)
        request_status = {req.project_id: req.status for req in collaboration_requests}
        
        # Apply recommendation using Gemini if requested
        recommendations = {}
        if recommend == 'true' and collaborator.expertise:
            # Prepare project data for Gemini API
            projects_data = []
            for project in projects:
                projects_data.append({
                    "id": str(project.id),
                    "title": project.title,
                    "description": project.description,
                    "tech_stack": project.tech_stack,
                    "sdgs": project.sdgs
                })
                
            # Get recommendations from Gemini API
            if projects_data:
                recommendations = generate_gemini_recommendations(collaborator.expertise, projects_data)
            
            # Sort projects by recommendation score
            projects_with_scores = []
            for project in projects:
                project_id = str(project.id)
                if project_id in recommendations:
                    recommendation_data = recommendations[project_id]
                    project.recommendation_score = recommendation_data.get('score', 0)
                    project.recommendation_explanation = recommendation_data.get('explanation', '')
                    projects_with_scores.append(project)
            
            # Sort by recommendation score (highest first)
            projects_with_scores.sort(key=lambda x: x.recommendation_score, reverse=True)
            
            # Only show projects with a score above threshold (e.g., 20)
            threshold = 20
            projects = [p for p in projects_with_scores if p.recommendation_score >= threshold]
        
        # Add request status and format tech_stack and sdgs for each project
        for project in projects:
            project.request_status = request_status.get(project.id)
            project.owner_name = project.group.name if project.group else project.student.full_name
            project.owner_type = 'Group' if project.group else 'Student'
            
            # Format tech stack and SDGs as lists
            project.tech_stack_list = [tech.strip() for tech in project.tech_stack.split(',') if tech.strip()]
            project.sdgs_list = [sdg.strip() for sdg in project.sdgs.split(',') if sdg.strip()]
        
        # Get unique tech stacks and SDGs for filters
        all_tech_stacks = Project.objects.filter(is_open_for_collaboration=True).values_list('tech_stack', flat=True).distinct()
        all_sdgs = Project.objects.filter(is_open_for_collaboration=True).values_list('sdgs', flat=True).distinct()
        
        # Format these for the template
        tech_stack_options = []
        for techs in all_tech_stacks:
            tech_stack_options.extend([tech.strip() for tech in techs.split(',')])
        tech_stack_options = list(set(tech_stack_options))
        
        sdg_options = []
        for all_sdg in all_sdgs:
            sdg_options.extend([sdg.strip() for sdg in all_sdg.split(',')])
        sdg_options = list(set(sdg_options))
        
        context = {
            'projects': projects,
            'search_query': search_query,
            'tech_stack': tech_stack,
            'sdgs': sdgs,
            'status': status,
            'recommend': recommend,
            'tech_stack_options': tech_stack_options,
            'sdg_options': sdg_options,
            'status_choices': Project._meta.get_field('status').choices,
        }
        return render(request, 'collaborator/shared_projects.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')


@login_required
def shared_project_details(request, project_id):
    """Display detailed view of a specific shared project"""
    try:
        collaborator = request.user.collaborator_profile
        
        # Get the project with related data
        project = get_object_or_404(
            Project.objects.select_related('group', 'student', 'mentor'),
            id=project_id, 
            is_open_for_collaboration=True
        )
        
        # Get collaboration request status if exists
        try:
            collab_request = CollaborationRequest.objects.get(
                collaborator=collaborator,
                project=project
            )
            project.request_status = collab_request.status
        except CollaborationRequest.DoesNotExist:
            project.request_status = None
        
        # Add owner info
        if project.group:
            project.owner_name = project.group.name
            project.owner_type = 'Group'
            # Get group members with their emails
            group_members = project.group.members.select_related('user').all()
            project.team_members = [
                {
                    'name': member.full_name,
                    'email': member.user.email,
                    'role': 'Leader' if member == project.group.leader else 'Member'
                }
                for member in group_members
            ]
        else:
            project.owner_name = project.student.full_name
            project.owner_type = 'Student'
            project.team_members = [
                {
                    'name': project.student.full_name,
                    'email': project.student.user.email,
                    'role': 'Owner'
                }
            ]
        
        # Add mentor info if exists
        if project.mentor:
            project.mentor_info = {
                'name': project.mentor.full_name,
                'email': project.mentor.user.email,
                'role': 'Mentor'
            }
        
        # Format tech stack and SDGs as lists for display
        project.tech_stack_list = [tech.strip() for tech in project.tech_stack.split(',')]
        project.sdgs_list = [sdg.strip() for sdg in project.sdgs.split(',')]
        
        context = {
            'project': project,
        }
        
        return render(request, 'collaborator/shared_project_detail.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('view_shared_projects')

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
def collab_schedule_meeting(request, project_id):
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
            scheduled_time_str = request.POST.get('scheduled_time')
            
            # Convert the string to a datetime object and make it timezone-aware
            from datetime import datetime
            scheduled_time = datetime.fromisoformat(scheduled_time_str)
            scheduled_time = timezone.make_aware(scheduled_time) if timezone.is_naive(scheduled_time) else scheduled_time
            
            duration = request.POST.get('duration')
            zoom_link = request.POST.get('zoom_link')
            zoom_meeting_id = request.POST.get('zoom_meeting_id')
            zoom_password = request.POST.get('zoom_password')
            
            # Create the meeting based on whether project is associated with student or group
            meeting_data = {
                'collaborator': collaborator,
                'project': project,
                'meeting_title': meeting_title,
                'meeting_description': meeting_description,
                'scheduled_time': scheduled_time,
                'duration': duration,
                'zoom_link': zoom_link,
                'zoom_meeting_id': zoom_meeting_id,
                'zoom_password': zoom_password
            }
            
            # Add either student or group
            if project.student:
                meeting_data['student'] = project.student
            elif project.group:
                meeting_data['group'] = project.group
            
            meeting = CollabZoomMeeting.objects.create(**meeting_data)
            
            # Add debug print to confirm meeting creation
            print(f"Meeting created with ID: {meeting.id}")
            
            messages.success(request, 'Meeting scheduled successfully!')
            return redirect('view_meetings', project_id=project_id)
            
        context = {
            'project': project
        }
        return render(request, 'collaborator/collab_schedule_meeting.html', context)
        
    except Exception as e:
        print(f"Error in collab_schedule_meeting: {e}")  # Add this for debugging
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')
    

# Views for CollabZoomMeetings

@login_required
def view_meetings(request, project_id):
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
        
        # Get all meetings related to this project
        meetings = CollabZoomMeeting.objects.filter(
            project=project,
            collaborator=collaborator
        ).order_by('-scheduled_time')
        
        context = {
            'project': project,
            'meetings': meetings
        }
        return render(request, 'collaborator/view_meetings.html', context)
        
    except Exception as e:
        print(f"Error in view_meetings: {e}")
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')

@login_required
def update_meeting(request, meeting_id):
    try:
        collaborator = request.user.collaborator_profile
        meeting = get_object_or_404(CollabZoomMeeting, id=meeting_id, collaborator=collaborator)
        project = meeting.project
        
        if request.method == 'POST':
            meeting_title = request.POST.get('meeting_title')
            meeting_description = request.POST.get('meeting_description')
            scheduled_time_str = request.POST.get('scheduled_time')
            
            # Convert the string to a datetime object and make it timezone-aware
            from datetime import datetime
            scheduled_time = datetime.fromisoformat(scheduled_time_str)
            scheduled_time = timezone.make_aware(scheduled_time) if timezone.is_naive(scheduled_time) else scheduled_time
            
            duration = request.POST.get('duration')
            zoom_link = request.POST.get('zoom_link')
            zoom_meeting_id = request.POST.get('zoom_meeting_id')
            zoom_password = request.POST.get('zoom_password')
            status = request.POST.get('status')
            
            # Update meeting details
            meeting.meeting_title = meeting_title
            meeting.meeting_description = meeting_description
            meeting.scheduled_time = scheduled_time
            meeting.duration = duration
            meeting.zoom_link = zoom_link
            meeting.zoom_meeting_id = zoom_meeting_id
            meeting.zoom_password = zoom_password
            if status in ['scheduled', 'completed', 'cancelled']:
                meeting.status = status
            
            meeting.save()
            
            messages.success(request, 'Meeting updated successfully!')
            return redirect('view_meetings', project_id=project.id)
        
        context = {
            'meeting': meeting,
            'project': project
        }
        return render(request, 'collaborator/update_meeting.html', context)
        
    except Exception as e:
        print(f"Error in update_meeting: {e}")
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')

@login_required
def delete_meeting(request, meeting_id):
    try:
        collaborator = request.user.collaborator_profile
        meeting = get_object_or_404(CollabZoomMeeting, id=meeting_id, collaborator=collaborator)
        project_id = meeting.project.id
        
        if request.method == 'POST':
            meeting.delete()
            messages.success(request, 'Meeting deleted successfully!')
            return redirect('view_meetings', project_id=project_id)
        
        context = {
            'meeting': meeting
        }
        return render(request, 'collaborator/confirm_delete_meeting.html', context)
        
    except Exception as e:
        print(f"Error in delete_meeting: {e}")
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('collaborator_dashboard')

@login_required
def all_collaborator_meetings(request):
    try:
        collaborator = request.user.collaborator_profile
        
        # Get filter parameters
        status_filter = request.GET.get('status', '')
        date_from = request.GET.get('date_from', '')
        date_to = request.GET.get('date_to', '')
        
        # Base query for all meetings for this collaborator
        meetings = CollabZoomMeeting.objects.filter(collaborator=collaborator)
        
        # Apply filters if provided
        if status_filter and status_filter in ['scheduled', 'completed', 'cancelled']:
            meetings = meetings.filter(status=status_filter)
            
        # Filter by date range if provided
        if date_from:
            try:
                from_date = timezone.make_aware(datetime.strptime(date_from, '%Y-%m-%d'))
                meetings = meetings.filter(scheduled_time__gte=from_date)
            except ValueError:
                messages.error(request, 'Invalid "From" date format. Please use YYYY-MM-DD.')
        
        if date_to:
            try:
                to_date = timezone.make_aware(datetime.strptime(date_to, '%Y-%m-%d'))
                # Add a day to include the end date fully
                to_date = to_date + timedelta(days=1)
                meetings = meetings.filter(scheduled_time__lt=to_date)
            except ValueError:
                messages.error(request, 'Invalid "To" date format. Please use YYYY-MM-DD.')
        
        # Default ordering by scheduled time, showing upcoming meetings first
        meetings = meetings.order_by('scheduled_time')
        
        # Group meetings by project for better organization
        projects_with_meetings = {}
        for meeting in meetings:
            if meeting.project.id not in projects_with_meetings:
                projects_with_meetings[meeting.project.id] = {
                    'project': meeting.project,
                    'meetings': []
                }
            projects_with_meetings[meeting.project.id]['meetings'].append(meeting)
        
        context = {
            'projects_with_meetings': projects_with_meetings,
            'status_filter': status_filter,
            'date_from': date_from,
            'date_to': date_to
        }
        return render(request, 'collaborator/all_collaborator_meetings.html', context)
        
    except Exception as e:
        print(f"Error in all_collaborator_meetings: {e}")
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
