from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import MentorProfile, ZoomMeeting
from college.models import CollegeProfile
from students.models import StudentProfile, MentorConnection, Project, StudentGroup, CollaborationRequest
from collabrators.models import CollaboratorProfile

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
                    if mentor.full_name and mentor.highest_qualification and mentor.specialization:
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
        college_code = request.POST.get('college_code')  # Get college code from form

        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'mentor/mentor_signup.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'mentor/mentor_signup.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return render(request, 'mentor/mentor_signup.html')

        try:
            # Find college by college code
            college = CollegeProfile.objects.filter(college_code=college_code).first()
            if not college:
                messages.error(request, 'Invalid college code. Please check and try again.')
                return render(request, 'mentor/mentor_signup.html')
            
            # Create user and mentor profile
            user = User.objects.create_user(username=username, email=email, password=password1)
            mentor = MentorProfile.objects.create(
                user=user,
                verification_status='pending',
                college=college,
                full_name=username  # Set initial full name as username
            )
            
            login(request, user)
            messages.info(request, f'Account created successfully! Your application is under review by {college.college_name}. Please wait for verification.')
            return redirect('mentor_dashboard')
            
        except Exception as e:
            if 'user' in locals():
                user.delete()
            messages.error(request, 'An error occurred during signup. Please try again.')
            return render(request, 'mentor/mentor_signup.html')

    # Get list of colleges for the form
    colleges = CollegeProfile.objects.all()
    return render(request, 'mentor/mentor_signup.html', {'colleges': colleges})

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
            'verification_status': mentor.get_verification_status_display(),
            'college_name': mentor.college.college_name if mentor.college else 'Unknown College'
        }
        
        # If mentor is not approved, show limited dashboard with pending message
        if mentor.verification_status == 'pending':
            messages.info(request, '.')
            return render(request, 'mentor/mentor_pending_dashboard.html', context)
        elif mentor.verification_status == 'rejected':
            messages.error(request, 'Your application has been rejected by the college.')
            return render(request, 'mentor/mentor_rejected_dashboard.html', context)
        elif mentor.verification_status == 'approved':
            return render(request, 'mentor_dashboard.html', context)
            
    except MentorProfile.DoesNotExist:
        messages.error(request, 'Mentor profile not found.')
        return redirect('mentor_login')

@login_required
def mentor_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('landing')

@login_required
def list_students(request):
    try:
        mentor = request.user.mentor_profile
        
        # Only approved mentors can view students
        if mentor.verification_status != 'approved':
            messages.error(request, 'You need to be approved by the college to view students.')
            return redirect('mentor_dashboard')

        # Get all students and their connection status with this mentor
        from students.models import StudentProfile, MentorConnection
        students = StudentProfile.objects.all()
        
        students_with_status = []
        for student in students:
            connection = MentorConnection.objects.filter(
                student=student,
                mentor=mentor
            ).first()
            students_with_status.append({
                'student': student,
                'connection_status': connection.status if connection else None
            })
        
        context = {
            'students': students_with_status
        }
        return render(request, 'mentor/list_students.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('mentor_dashboard')

@login_required
def connection_requests(request):
    try:
        mentor = request.user.mentor_profile
        
        # Only approved mentors can view connection requests
        if mentor.verification_status != 'approved':
            messages.error(request, 'You need to be approved by the college to manage connection requests.')
            return redirect('mentor_dashboard')

        # Get all connection requests for this mentor
        from students.models import MentorConnection
        connections = MentorConnection.objects.filter(mentor=mentor).order_by('-created_at')
        
        context = {
            'connections': connections
        }
        return render(request, 'mentor/connection_requests.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('mentor_dashboard')

@login_required
def handle_connection_request(request, connection_id, action):
    if request.method != 'POST':
        return redirect('connection_requests')
        
    try:
        mentor = request.user.mentor_profile
        
        # Only approved mentors can handle requests
        if mentor.verification_status != 'approved':
            messages.error(request, 'You need to be approved by the college to handle connection requests.')
            return redirect('mentor_dashboard')

        # Get the connection request
        from students.models import MentorConnection
        connection = get_object_or_404(MentorConnection, id=connection_id, mentor=mentor)
        
        # Handle the action
        if action == 'accept' and connection.status == 'pending':
            connection.status = 'accepted'
            messages.success(request, f'You have accepted the connection request from {connection.student.full_name}.')
        elif action == 'reject' and connection.status == 'pending':
            connection.status = 'rejected'
            messages.success(request, f'You have rejected the connection request from {connection.student.full_name}.')
        else:
            messages.error(request, 'Invalid action or connection request status.')
            
        connection.save()
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
    
    return redirect('connection_requests')

@login_required
def connected_students(request):
    try:
        mentor = request.user.mentor_profile
        
        # Only approved mentors can view connected students
        if mentor.verification_status != 'approved':
            messages.error(request, 'You need to be approved by the college to view connected students.')
            return redirect('mentor_dashboard')

        # Get all accepted connections for this mentor
        from students.models import MentorConnection
        connections = MentorConnection.objects.filter(
            mentor=mentor,
            status='accepted'
        ).order_by('-updated_at')
        
        context = {
            'connections': connections
        }
        return render(request, 'mentor/connected_students.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('mentor_dashboard')

@login_required
def mentor_projects(request):
    try:
        mentor = request.user.mentor_profile
        
        # Only approved mentors can view projects
        if mentor.verification_status != 'approved':
            messages.error(request, 'You need to be approved by the college to view projects.')
            return redirect('mentor_dashboard')

        # Get all projects shared with this mentor
        projects = Project.objects.filter(mentor=mentor).select_related('student', 'group').prefetch_related('group__leader', 'group__members')
        
        context = {
            'projects': projects
        }
        return render(request, 'mentor/mentor_projects.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('mentor_dashboard')

@login_required
def review_project(request, project_id):
    try:
        mentor = request.user.mentor_profile
        
        # Only approved mentors can review projects
        if mentor.verification_status != 'approved':
            messages.error(request, 'You need to be approved by the college to review projects.')
            return redirect('mentor_dashboard')
            
        project = get_object_or_404(Project, id=project_id, mentor=mentor)
        
        if request.method == 'POST':
            feedback = request.POST.get('feedback')
            grade = request.POST.get('grade')
            status = request.POST.get('status')
            
            if feedback:
                project.mentor_feedback = feedback
            
            if grade:
                try:
                    grade = int(grade)
                    if 0 <= grade <= 100:
                        project.mentor_grade = grade
                    else:
                        messages.error(request, 'Grade must be between 0 and 100.')
                        return redirect('review_project', project_id=project_id)
                except ValueError:
                    messages.error(request, 'Invalid grade value.')
                    return redirect('review_project', project_id=project_id)
            
            if status in ['in_progress', 'completed', 'under_review']:
                project.status = status
            
            project.save()
            messages.success(request, 'Project review submitted successfully!')
            return redirect('mentor_projects')
        
        context = {
            'project': project
        }
        return render(request, 'mentor/review_project.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('mentor_projects')

@login_required
def schedule_meeting(request, student_id):
    try:
        mentor = request.user.mentor_profile
        student = get_object_or_404(StudentProfile, id=student_id)
        
        # Check if mentor is connected with the student
        connection = MentorConnection.objects.filter(
            mentor=mentor,
            student=student,
            status='accepted'
        ).first()
        
        if not connection:
            messages.error(request, 'You can only schedule meetings with connected students.')
            return redirect('connected_students')
            
        if request.method == 'POST':
            title = request.POST.get('title')
            description = request.POST.get('description')
            meeting_link = request.POST.get('meeting_link')
            meeting_time = request.POST.get('meeting_time')
            duration = request.POST.get('duration')
            
            if all([title, meeting_link, meeting_time, duration]):
                try:
                    from datetime import datetime
                    meeting_time = datetime.strptime(meeting_time, '%Y-%m-%dT%H:%M')
                    duration = int(duration)
                    
                    meeting = ZoomMeeting.objects.create(
                        mentor=mentor,
                        student=student,
                        title=title,
                        description=description,
                        meeting_link=meeting_link,
                        meeting_time=meeting_time,
                        duration=duration
                    )
                    
                    # Send email notification
                    meeting.send_notification_emails(notification_type='scheduled')
                    
                    messages.success(request, 'Meeting scheduled successfully! Email notifications have been sent.')
                    return redirect('meeting_detail', meeting_id=meeting.id)
                except Exception as e:
                    messages.error(request, f'Error scheduling meeting: {str(e)}')
            else:
                messages.error(request, 'Please fill all required fields.')
        
        context = {
            'student': student,
            'connection': connection
        }
        return render(request, 'mentor/schedule_meeting.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('connected_students')

@login_required
def update_meeting(request, meeting_id):
    try:
        mentor = request.user.mentor_profile
        meeting = get_object_or_404(ZoomMeeting, id=meeting_id, mentor=mentor, status='scheduled')
        
        if request.method == 'POST':
            title = request.POST.get('title')
            description = request.POST.get('description')
            meeting_link = request.POST.get('meeting_link')
            meeting_time = request.POST.get('meeting_time')
            duration = request.POST.get('duration')
            
            if all([title, meeting_link, meeting_time, duration]):
                try:
                    from datetime import datetime
                    meeting_time = datetime.strptime(meeting_time, '%Y-%m-%dT%H:%M')
                    duration = int(duration)
                    
                    # Update meeting details
                    meeting.title = title
                    meeting.description = description
                    meeting.meeting_link = meeting_link
                    meeting.meeting_time = meeting_time
                    meeting.duration = duration
                    meeting.save()
                    
                    # Send email notification about updated meeting
                    meeting.send_notification_emails(notification_type='updated')
                    
                    messages.success(request, 'Meeting updated successfully! Email notifications have been sent.')
                    return redirect('meeting_detail', meeting_id=meeting.id)
                except Exception as e:
                    messages.error(request, f'Error updating meeting: {str(e)}')
            else:
                messages.error(request, 'Please fill all required fields.')
                
        context = {
            'meeting': meeting
        }
        return render(request, 'mentor/update_meeting.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('meeting_list')

@login_required
def cancel_meeting(request, meeting_id):
    if request.method != 'POST':
        return redirect('meeting_list')
        
    try:
        mentor = request.user.mentor_profile
        meeting = get_object_or_404(ZoomMeeting, id=meeting_id, mentor=mentor, status='scheduled')
        
        meeting.status = 'cancelled'
        meeting.save()
        
        # Send cancellation email notification
        meeting.send_notification_emails(notification_type='cancelled')
        
        messages.success(request, 'Meeting cancelled successfully. Email notifications have been sent.')
        return redirect('meeting_list')
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('meeting_list')

@login_required
def meeting_detail(request, meeting_id):
    try:
        mentor = request.user.mentor_profile
        meeting = get_object_or_404(ZoomMeeting, id=meeting_id, mentor=mentor)
        
        context = {
            'meeting': meeting
        }
        return render(request, 'mentor/meeting_detail.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('meeting_list')

@login_required
def meeting_list(request):
    try:
        mentor = request.user.mentor_profile
        meetings = ZoomMeeting.objects.filter(mentor=mentor)
        
        # Filter by status if provided
        status = request.GET.get('status')
        if status in ['scheduled', 'completed', 'cancelled']:
            meetings = meetings.filter(status=status)
            
        context = {
            'meetings': meetings
        }
        return render(request, 'mentor/meeting_list.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('mentor_dashboard')

@login_required
def view_collaborators(request):
    mentor = get_object_or_404(MentorProfile, user=request.user)
    collaborators = CollaboratorProfile.objects.all()
    
    collaborator_data = []
    for collaborator in collaborators:
        # Get all collaboration requests by this collaborator
        collaboration_requests = CollaborationRequest.objects.filter(
            collaborator=collaborator
        ).select_related('project', 'project__student', 'project__group')
        
        # Get accepted collaborations
        accepted_collaborations = collaboration_requests.filter(status='accepted')
        
        # Get connected students through accepted project collaborations
        connected_students = set()
        connected_groups = set()
        
        for collab in accepted_collaborations:
            if collab.project.student:
                connected_students.add(collab.project.student)
            if collab.project.group:
                connected_groups.add(collab.project.group)
        
        collaborator_data.append({
            'profile': collaborator,
            'total_requests': collaboration_requests.count(),
            'accepted_collaborations': accepted_collaborations.count(),
            'connected_students': list(connected_students),
            'connected_groups': list(connected_groups),
            'recent_collaborations': accepted_collaborations[:5]  # Get 5 most recent collaborations
        })
    
    context = {
        'mentor': mentor,
        'collaborator_data': collaborator_data,
        'total_collaborators': len(collaborators)
    }
    
    return render(request, 'mentor/view_collaborators.html', context)