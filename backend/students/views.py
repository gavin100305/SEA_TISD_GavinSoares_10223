from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import StudentProfile, MentorConnection, Project, StudentGroup, GroupMembership, CollaborationRequest, ProjectComment
from mentor.models import MentorProfile, ZoomMeeting
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from college.models import CollegeProfile, NGO, ProjectAssessment
from django.db.models import Q
from django.utils import timezone
from collabrators.models import CollaboratorProfile
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from datetime import date



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
    try:
        student = request.user.student_profile
        
        # Get individual and group projects
        individual_projects = Project.objects.filter(student=student)
        group_projects = Project.objects.filter(group__leader=student)
        
        # Get collaboration request counts
        individual_requests = CollaborationRequest.objects.filter(project__in=individual_projects)
        group_requests = CollaborationRequest.objects.filter(project__in=group_projects)
        
        # Count pending requests
        pending_requests_count = (
            individual_requests.filter(status='pending').count() +
            group_requests.filter(status='pending').count()
        )
        
        context = {
            'student': student,
            'individual_requests_count': individual_requests.count(),
            'group_requests_count': group_requests.count(),
            'pending_requests_count': pending_requests_count,
        }
        return render(request, 'student/student_dashboard.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('landing_page')

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
        
        # Get collaboration requests for projects
        collaboration_requests = CollaborationRequest.objects.filter(
            project__in=projects,
            status='pending'
        ).count()
        
        context = {
            'projects': projects,
            'pending_requests': collaboration_requests,
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

@login_required
def my_groups(request):
    student = request.user.student_profile
    led_groups = student.led_groups.all()
    member_groups = StudentGroup.objects.filter(
        groupmembership__student=student,
        groupmembership__status='accepted'
    )
    pending_invites = GroupMembership.objects.filter(
        student=student,
        status='pending'
    )
    
    context = {
        'led_groups': led_groups,
        'member_groups': member_groups,
        'pending_invites': pending_invites,
    }
    return render(request, 'student/my_groups.html', context)

@login_required
def create_group(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        student = request.user.student_profile

        if StudentGroup.objects.filter(name=name).exists():
            messages.error(request, 'A group with this name already exists.')
            return redirect('create_group')

        group = StudentGroup.objects.create(
            name=name,
            description=description,
            leader=student
        )
        
        # Automatically add leader as a member
        GroupMembership.objects.create(
            student=student,
            group=group,
            status='accepted'
        )

        messages.success(request, 'Group created successfully!')
        return redirect('group_detail', group_id=group.id)

    return render(request, 'student/create_group.html')

@login_required
def group_detail(request, group_id):
    group = get_object_or_404(StudentGroup, id=group_id)
    student = request.user.student_profile
    
    # Check if user is leader or member
    is_leader = group.leader == student
    is_member = group.members.filter(id=student.id, groupmembership__status='accepted').exists()
    
    if not (is_leader or is_member):
        messages.error(request, 'You do not have permission to view this group.')
        return redirect('my_groups')
    
    members = group.groupmembership_set.filter(status='accepted')
    pending_members = group.groupmembership_set.filter(status='pending')
    projects = group.group_projects.all()
    
    context = {
        'group': group,
        'is_leader': is_leader,
        'members': members,
        'pending_members': pending_members,
        'projects': projects,
    }
    return render(request, 'student/group_detail.html', context)

@login_required
def invite_member(request, group_id):
    group = get_object_or_404(StudentGroup, id=group_id)
    student = request.user.student_profile
    
    if group.leader != student:
        messages.error(request, 'Only the group leader can invite members.')
        return redirect('group_detail', group_id=group.id)
    
    if request.method == 'POST':
        username = request.POST.get('username')
        try:
            invited_student = User.objects.get(username=username).student_profile
            
            # Check if student is already a member or invited
            if GroupMembership.objects.filter(student=invited_student, group=group).exists():
                messages.error(request, 'This student is already a member or has a pending invitation.')
                return redirect('group_detail', group_id=group.id)
            
            GroupMembership.objects.create(
                student=invited_student,
                group=group,
                status='pending'
            )
            messages.success(request, f'Invitation sent to {invited_student.full_name}')
            
        except User.DoesNotExist:
            messages.error(request, 'Student not found.')
    
    return redirect('group_detail', group_id=group.id)

@login_required
def handle_invitation(request, membership_id):
    membership = get_object_or_404(GroupMembership, id=membership_id)
    student = request.user.student_profile
    
    if membership.student != student:
        messages.error(request, 'Invalid invitation.')
        return redirect('my_groups')
    
    action = request.POST.get('action')
    if action == 'accept':
        membership.status = 'accepted'
        membership.save()
        messages.success(request, f'You have joined {membership.group.name}')
    elif action == 'reject':
        membership.delete()
        messages.success(request, 'Invitation rejected.')
    
    return redirect('my_groups')

@login_required
def remove_member(request, group_id, member_id):
    group = get_object_or_404(StudentGroup, id=group_id)
    student = request.user.student_profile
    
    if group.leader != student:
        messages.error(request, 'Only the group leader can remove members.')
        return redirect('group_detail', group_id=group.id)
    
    membership = get_object_or_404(GroupMembership, group=group, student_id=member_id)
    if membership.student == group.leader:
        messages.error(request, 'Group leader cannot be removed.')
    else:
        membership.delete()
        messages.success(request, 'Member removed successfully.')
    
    return redirect('group_detail', group_id=group.id)

@login_required
def add_group_project(request, group_id):
    group = get_object_or_404(StudentGroup, id=group_id)
    student = request.user.student_profile
    
    # Verify user is group leader or member
    if not group.members.filter(id=student.id, groupmembership__status='accepted').exists():
        messages.error(request, 'You must be a group member to add projects.')
        return redirect('my_groups')
    
    # Get connected mentors of the group leader
    connected_mentors = MentorConnection.objects.filter(
        student=group.leader,
        status='accepted'
    ).select_related('mentor')
    
    if request.method == 'POST':
        try:
            mentor_id = request.POST.get('mentor')
            mentor = None
            if mentor_id:
                mentor = MentorProfile.objects.get(id=mentor_id)
                
                # Verify mentor connection with group leader
                if not MentorConnection.objects.filter(
                    student=group.leader,
                    mentor=mentor,
                    status='accepted'
                ).exists():
                    messages.error(request, 'The group leader must be connected with the mentor.')
                    return redirect('group_detail', group_id=group.id)
            
            # Create project
            project = Project.objects.create(
                group=group,
                mentor=mentor,
                title=request.POST.get('title'),
                description=request.POST.get('description'),
                sdgs=request.POST.get('sdgs'),
                tech_stack=request.POST.get('tech_stack'),
                is_open_for_collaboration=request.POST.get('is_open_for_collaboration') == 'on'
            )
            
            messages.success(request, 'Group project added successfully!')
            return redirect('group_detail', group_id=group.id)
            
        except Exception as e:
            messages.error(request, f'An error occurred: {str(e)}')
            return redirect('group_detail', group_id=group.id)
    
    context = {
        'group': group,
        'connected_mentors': connected_mentors
    }
    return render(request, 'student/add_group_project.html', context)

@login_required
def student_meetings(request):
    try:
        student = request.user.student_profile
        meetings = ZoomMeeting.objects.filter(student=student)
        
        # Get connected mentors for scheduling meetings
        connected_mentors = MentorConnection.objects.filter(
            student=student,
            status='accepted'
        ).select_related('mentor')
        
        if request.method == 'POST':
            mentor_id = request.POST.get('mentor')
            title = request.POST.get('title')
            description = request.POST.get('description')
            meeting_link = request.POST.get('meeting_link')
            meeting_time = request.POST.get('meeting_time')
            duration = request.POST.get('duration')
            
            try:
                mentor = MentorProfile.objects.get(id=mentor_id)
                if not MentorConnection.objects.filter(student=student, mentor=mentor, status='accepted').exists():
                    messages.error(request, 'You can only schedule meetings with connected mentors.')
                else:
                    ZoomMeeting.objects.create(
                        student=student,
                        mentor=mentor,
                        title=title,
                        description=description,
                        meeting_link=meeting_link,
                        meeting_time=meeting_time,
                        duration=duration,
                        status='scheduled'
                    )
                    messages.success(request, 'Meeting scheduled successfully!')
            except Exception as e:
                messages.error(request, f'Failed to schedule meeting: {str(e)}')
        
        # Filter by status if provided
        status = request.GET.get('status')
        if status in ['scheduled', 'completed', 'cancelled']:
            meetings = meetings.filter(status=status)
            
        context = {
            'meetings': meetings,
            'now': timezone.now(),
            'connected_mentors': connected_mentors
        }
        return render(request, 'student/student_meetings.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('student_dashboard')

@login_required
def meeting_detail(request, meeting_id):
    try:
        student = request.user.student_profile
        meeting = get_object_or_404(ZoomMeeting, id=meeting_id, student=student)
        
        context = {
            'meeting': meeting
        }
        return render(request, 'student/meeting_detail.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('student_meetings')

@login_required
def view_collaborators(request):
    """View all registered collaborators on the platform"""
    # Get all users who have a collaborator profile
    collaborators = User.objects.filter(collaborator_profile__isnull=False).select_related('collaborator_profile').order_by('username')
    
    # Get the search query from GET parameters
    search_query = request.GET.get('search', '')
    if search_query:
        collaborators = collaborators.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(collaborator_profile__full_name__icontains=search_query) |
            Q(collaborator_profile__expertise__icontains=search_query) |
            Q(collaborator_profile__company__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(collaborators, 12)  # Show 12 collaborators per page
    page = request.GET.get('page')
    try:
        collaborators_page = paginator.page(page)
    except PageNotAnInteger:
        collaborators_page = paginator.page(1)
    except EmptyPage:
        collaborators_page = paginator.page(paginator.num_pages)
    
    context = {
        'collaborators': collaborators_page,
        'search_query': search_query,
    }
    return render(request, 'student/view_collaborators.html', context)

@login_required
def toggle_project_collaboration(request, project_id):
    """Toggle whether a project is open for collaboration"""
    project = get_object_or_404(Project, id=project_id)
    student = request.user.student_profile
    
    # Check if user has permission to modify this project
    if (project.student != student) and (not project.group or project.group.leader != student):
        messages.error(request, 'You do not have permission to modify this project.')
        return redirect('my_projects')
    
    project.is_open_for_collaboration = not project.is_open_for_collaboration
    project.save()
    
    status = 'opened' if project.is_open_for_collaboration else 'closed'
    messages.success(request, f'Project has been {status} for collaboration.')
    return redirect('my_projects')

@login_required
def view_collaboration_requests(request):
    """View collaboration requests for student's projects"""
    student = request.user.student_profile
    
    # Get all projects where student is owner or group leader
    individual_projects = Project.objects.filter(student=student)
    group_projects = Project.objects.filter(group__leader=student)
    
    # Get collaboration requests for these projects
    status = request.GET.get('status')
    
    # Get individual project requests
    individual_requests = CollaborationRequest.objects.filter(project__in=individual_projects)
    if status:
        individual_requests = individual_requests.filter(status=status)
    
    # Get group project requests
    group_requests = CollaborationRequest.objects.filter(project__in=group_projects)
    if status:
        group_requests = group_requests.filter(status=status)
    
    # Check if user is a group leader for any projects
    is_group_leader = StudentGroup.objects.filter(leader=student).exists()
    
    context = {
        'individual_requests': individual_requests,
        'group_requests': group_requests,
        'is_group_leader': is_group_leader,
    }
    return render(request, 'student/view_collaboration_requests.html', context)

@login_required
@require_POST
def handle_collaboration_request(request, request_id):
    """Accept or reject a collaboration request"""
    collab_request = get_object_or_404(CollaborationRequest, id=request_id)
    student = request.user.student_profile
    
    # Verify ownership
    project = collab_request.project
    is_owner = (project.student == student) or (project.group and project.group.leader == student)
    
    if not is_owner:
        messages.error(request, 'You do not have permission to handle this request.')
        return redirect('view_collaboration_requests')
    
    action = request.POST.get('action')
    if action == 'accept':
        collab_request.status = 'accepted'
        messages.success(request, f'Collaboration request from {collab_request.collaborator} has been accepted.')
    elif action == 'reject':
        collab_request.status = 'rejected'
        messages.success(request, f'Collaboration request from {collab_request.collaborator} has been rejected.')
    else:
        messages.error(request, 'Invalid action.')
        return redirect('view_collaboration_requests')
    
    collab_request.save()
    return redirect('view_collaboration_requests')

@login_required
def view_project_comments(request, project_id):
    """View comments on a project"""
    project = get_object_or_404(Project, id=project_id)
    student = request.user.student_profile
    
    # Check if user has permission to view this project
    if project.student != student and (project.group and project.group.leader != student):
        messages.error(request, 'You do not have permission to view this project.')
        return redirect('my_projects')
    
    comments = project.comments.all()
    context = {
        'project': project,
        'comments': comments,
    }
    return render(request, 'student/project_comments.html', context)

@login_required
def schedule_meeting(request, project_id, collaborator_id):
    try:
        student = request.user.student_profile
        project = get_object_or_404(Project, id=project_id, student=student)
        collaborator = get_object_or_404(CollaboratorProfile, id=collaborator_id)
        
        # Verify if collaborator is connected to this project
        if not CollaborationRequest.objects.filter(
            project=project,
            collaborator=collaborator,
            status='accepted'
        ).exists():
            messages.error(request, 'This collaborator is not connected to your project.')
            return redirect('student_dashboard')
        
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
                student=student,
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
            return redirect('student_view_meetings', project_id=project_id)
            
        context = {
            'project': project,
            'collaborator': collaborator
        }
        return render(request, 'student/schedule_meeting.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('student_dashboard')

@login_required
def view_meetings(request, project_id=None):
    try:
        student = request.user.student_profile
        
        if project_id:
            # View meetings for a specific project
            project = get_object_or_404(Project, id=project_id, student=student)
            meetings = ZoomMeeting.objects.filter(
                student=student,
                project=project
            )
            context = {
                'project': project,
                'meetings': meetings
            }
            template = 'student/project_meetings.html'
        else:
            # View all meetings
            meetings = ZoomMeeting.objects.filter(student=student)
            context = {'meetings': meetings}
            template = 'student/all_meetings.html'
            
        return render(request, template, context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('student_dashboard')

@login_required
def update_meeting(request, meeting_id):
    try:
        student = request.user.student_profile
        meeting = get_object_or_404(ZoomMeeting, id=meeting_id, student=student)
        
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
            return redirect('student_view_meetings', project_id=meeting.project.id)
            
        context = {
            'meeting': meeting,
            'project': meeting.project,
            'collaborator': meeting.collaborator
        }
        return render(request, 'student/update_meeting.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('student_dashboard')

@login_required
def add_project_comment(request, project_id):
    if request.method == 'POST':
        project = get_object_or_404(Project, id=project_id)
        student = get_object_or_404(StudentProfile, user=request.user)
        content = request.POST.get('content')
        parent_id = request.POST.get('parent_id')
        
        if not content:
            messages.error(request, 'Comment content cannot be empty.')
            return redirect('my_projects')
        
        comment = ProjectComment(
            project=project,
            author_type='student',
            author_id=student.id,
            content=content
        )
        
        if parent_id:
            parent_comment = get_object_or_404(ProjectComment, id=parent_id)
            comment.parent_comment = parent_comment
        
        comment.save()
        messages.success(request, 'Comment added successfully!')
        return redirect('my_projects')
    return redirect('my_projects')

@login_required
def delete_project_comment(request, comment_id):
    comment = get_object_or_404(ProjectComment, id=comment_id)
    if comment.student and comment.student.user == request.user:
        comment.delete()
        messages.success(request, 'Comment deleted successfully!')
    else:
        messages.error(request, 'You do not have permission to delete this comment.')
    return redirect('my_projects')

@login_required
def view_assessments(request):
    student = request.user.student_profile
    
    # Get assessments for student's semester and branch
    assessments = ProjectAssessment.objects.filter(
        Q(target_semester=student.semester) & 
        Q(target_branch__iexact=student.branch) &  # Case-insensitive branch matching
        ~Q(status='cancelled')
    ).order_by('-created_at')
    
    # Update status based on current date
    current_date = date.today()
    for assessment in assessments:
        end_date = assessment.end_date.date() if assessment.end_date else None
        start_date = assessment.start_date.date() if assessment.start_date else None
        
        if end_date and end_date < current_date:
            assessment.status = 'completed'
        elif start_date and end_date and start_date <= current_date <= end_date:
            assessment.status = 'ongoing'
        else:
            assessment.status = 'upcoming'
        assessment.save()
    
    # Filter by status if provided
    status_filter = request.GET.get('status')
    if status_filter and status_filter != 'all':
        assessments = assessments.filter(status=status_filter)
    
    context = {
        'assessments': assessments,
        'current_status': status_filter or 'all',
        'student': student
    }
    return render(request, 'student/view_assessments.html', context)

@login_required
def assessment_detail(request, assessment_id):
    student = request.user.student_profile
    assessment = get_object_or_404(ProjectAssessment, id=assessment_id)
    
    # Check if student is allowed to view this assessment
    if student.semester != assessment.target_semester or student.branch.upper() != assessment.target_branch.upper():
        messages.error(request, 'You are not authorized to view this assessment.')
        return redirect('student_view_assessments')
    
    context = {
        'assessment': assessment,
        'student': student
    }
    return render(request, 'student/assessment_detail.html', context)




