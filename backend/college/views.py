from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import CollegeProfile,NGO, ProjectAssessment
from mentor.models import MentorProfile
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import CollegeProfileSerializer,UserSerializer,NGOSerializer,ProjectAssessmentSerializer
from django.forms import ModelForm
from django.db.models import Count, Avg, Q
from students.models import StudentProfile, Project, MentorConnection, StudentGroup, CollaborationRequest
from collabrators.models import CollaboratorProfile
from datetime import datetime, date
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

import json
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import urllib
from django.db.models import Count, Sum, Avg, F, Case, When, IntegerField, Value
from django.db.models.functions import TruncMonth, TruncYear
from django.http import JsonResponse
from students.models import Project

@login_required
def project_statistics(request):
    """View to display statistical information about all projects"""
    try:
        college = CollegeProfile.objects.get(user=request.user)
        
        # Get all projects for this college
        projects = Project.objects.filter(college=college)
        
        # Basic statistics
        total_projects = projects.count()
        completed_projects = projects.filter(status='completed').count()
        in_progress_projects = projects.filter(status='in_progress').count()
        under_review_projects = projects.filter(status='under_review').count()
        
        # Projects by SDGs
        sdg_data = []
        for project in projects:
            sdgs = [sdg.strip() for sdg in project.sdgs.split(',')]
            for sdg in sdgs:
                if sdg:  # Ensure not empty
                    sdg_data.append(sdg)
                    
        sdg_counts = pd.Series(sdg_data).value_counts().to_dict()
        
        # Projects by tech stack
        tech_data = []
        for project in projects:
            techs = [tech.strip() for tech in project.tech_stack.split(',')]
            for tech in techs:
                if tech:  # Ensure not empty
                    tech_data.append(tech)
                    
        tech_counts = pd.Series(tech_data).value_counts().to_dict()
        
        # Projects by month/year
        projects_by_month = (
            projects
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        
        # Convert to format suitable for charts
        month_labels = [item['month'].strftime('%b %Y') for item in projects_by_month]
        month_counts = [item['count'] for item in projects_by_month]
        
        # Projects with mentor vs without mentor
        with_mentor = projects.filter(mentor__isnull=False).count()
        without_mentor = projects.filter(mentor__isnull=True).count()
        
        # Group projects vs individual projects
        group_projects = projects.filter(group__isnull=False).count()
        individual_projects = projects.filter(student__isnull=False).count()
        
        # Average mentor grade
        avg_grade = projects.filter(mentor_grade__isnull=False).aggregate(avg=Avg('mentor_grade'))['avg'] or 0
        
        # Open for collaboration stats
        open_for_collab = projects.filter(is_open_for_collaboration=True).count()
        with_collaborator = projects.filter(collaborator=True).count()
        
        context = {
            'college': college,
            'total_projects': total_projects,
            'completed_projects': completed_projects,
            'in_progress_projects': in_progress_projects,
            'under_review_projects': under_review_projects,
            'sdg_counts': json.dumps(sdg_counts),
            'tech_counts': json.dumps(tech_counts),
            'month_labels': json.dumps(month_labels),
            'month_counts': json.dumps(month_counts),
            'with_mentor': with_mentor,
            'without_mentor': without_mentor,
            'group_projects': group_projects,
            'individual_projects': individual_projects,
            'avg_grade': avg_grade,
            'open_for_collab': open_for_collab,
            'with_collaborator': with_collaborator,
        }
        
        return render(request, 'college/project_statistics.html', context)
        
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_dashboard')
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('college_dashboard')

@login_required
def project_charts_data(request):
    """API endpoint to get chart data for AJAX requests"""
    try:
        college = CollegeProfile.objects.get(user=request.user)
        projects = Project.objects.filter(college=college)
        chart_type = request.GET.get('chart_type', 'sdgs')
        
        if chart_type == 'sdgs':
            # SDG distribution
            sdg_data = []
            for project in projects:
                sdgs = [sdg.strip() for sdg in project.sdgs.split(',')]
                for sdg in sdgs:
                    if sdg:
                        sdg_data.append(sdg)
            
            sdg_counts = pd.Series(sdg_data).value_counts().to_dict()
            data = {
                'labels': list(sdg_counts.keys()),
                'datasets': [{
                    'label': 'SDGs Distribution',
                    'data': list(sdg_counts.values()),
                    'backgroundColor': [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#E7E9ED', '#6C757D', '#198754', '#FFC107'
                    ]
                }]
            }
            
        elif chart_type == 'tech_stack':
            # Tech stack distribution
            tech_data = []
            for project in projects:
                techs = [tech.strip() for tech in project.tech_stack.split(',')]
                for tech in techs:
                    if tech:
                        tech_data.append(tech)
            
            tech_counts = pd.Series(tech_data).value_counts().to_dict()
            data = {
                'labels': list(tech_counts.keys()),
                'datasets': [{
                    'label': 'Technologies Used',
                    'data': list(tech_counts.values()),
                    'backgroundColor': [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#E7E9ED', '#6C757D', '#198754', '#FFC107'
                    ]
                }]
            }
            
        elif chart_type == 'status':
            # Project status distribution
            status_counts = projects.values('status').annotate(count=Count('id'))
            status_dict = {item['status']: item['count'] for item in status_counts}
            
            data = {
                'labels': ['Completed', 'In Progress', 'Under Review'],
                'datasets': [{
                    'label': 'Project Status',
                    'data': [
                        status_dict.get('completed', 0),
                        status_dict.get('in_progress', 0),
                        status_dict.get('under_review', 0)
                    ],
                    'backgroundColor': ['#198754', '#0D6EFD', '#FFC107']
                }]
            }
            
        elif chart_type == 'timeline':
            # Projects created over time
            monthly_data = (
                projects
                .annotate(month=TruncMonth('created_at'))
                .values('month')
                .annotate(count=Count('id'))
                .order_by('month')
            )
            
            data = {
                'labels': [item['month'].strftime('%b %Y') for item in monthly_data],
                'datasets': [{
                    'label': 'Projects Created',
                    'data': [item['count'] for item in monthly_data],
                    'borderColor': '#36A2EB',
                    'fill': False
                }]
            }
            
        else:
            data = {'error': 'Invalid chart type'}
        
        return JsonResponse(data)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@login_required
def ngo_detail(request, ngo_id):
    """View to display details of a specific NGO"""
    try:
        profile = CollegeProfile.objects.get(user=request.user)
        ngo = get_object_or_404(NGO, id=ngo_id, college=profile)
        
        context = {
            'profile': profile,
            'ngo': ngo
        }
        return render(request, 'college/ngo_detail.html', context)
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_login')


def college_signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        email = request.POST.get('email')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists!')
            return redirect('college_signup')

        try:
            # Create user and profile in a transaction
            user = User.objects.create_user(username=username, password=password1, email=email)
            profile = CollegeProfile.objects.create(
                user=user,
                college_name=username,  # Set initial college name as username
                college_code=username.upper()  # Set initial college code as uppercase username
            )
            login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('college_dashboard')  # Redirect directly to dashboard
        except Exception as e:
            # If anything goes wrong, delete the user and show error
            if 'user' in locals():
                user.delete()
            messages.error(request, 'An error occurred during signup. Please try again.')
            return redirect('college_signup')

    return render(request, 'college_signup.html')

def college_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            try:
                # Check if college profile exists
                profile = CollegeProfile.objects.get(user=user)
                login(request, user)
                return redirect('college_dashboard')
            except CollegeProfile.DoesNotExist:
                messages.error(request, 'College profile not found!')
                return redirect('college_login')
        else:
            messages.error(request, 'Invalid username or password!')
            return redirect('college_login')

    return render(request, 'college_login.html')

@login_required
def college_logout(request):
    logout(request)
    messages.success(request, 'Logged out successfully!')
    return redirect('landing')

@login_required
def college_profile(request):
    profile = CollegeProfile.objects.get(user=request.user)

    if request.method == 'POST':
        profile.college_name = request.POST.get('college_name')
        profile.college_code = request.POST.get('college_code')
        profile.address = request.POST.get('address')
        profile.contact_number = request.POST.get('contact_number')
        profile.website = request.POST.get('website')
        profile.established_year = request.POST.get('established_year')
        profile.principal_name = request.POST.get('principal_name')
        profile.principal_email = request.POST.get('principal_email')
        profile.save()

        messages.success(request, 'Profile updated successfully!')
        return redirect('college_dashboard')

    return render(request, 'college_profile.html', {'profile': profile})

@login_required
def college_dashboard(request):
    try:
        profile = CollegeProfile.objects.get(user=request.user)
        # Get mentor counts by verification status
        pending_mentors = MentorProfile.objects.filter(
            college=profile,
            verification_status='pending'
        )
        pending_count = pending_mentors.count()
        verified_mentors = MentorProfile.objects.filter(
            college=profile,
            verification_status='approved'
        ).count()
        rejected_mentors = MentorProfile.objects.filter(
            college=profile,
            verification_status='rejected'
        ).count()

        students = StudentProfile.objects.all()
        mentors = MentorProfile.objects.all()

        total_students = students.count()
        total_mentors = mentors.count()
        
        context = {
            'profile': profile,
            'pending_mentors': pending_mentors,
            'pending_count': pending_count,
            'verified_mentors': verified_mentors,
            'rejected_mentors': rejected_mentors,
            'total_students': total_students,
            'total_mentors': total_mentors,
        }
        return render(request, 'college_dashboard.html', context)
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_login')

@login_required
def verify_mentor(request, mentor_id):
    if request.method == 'POST':
        mentor = get_object_or_404(MentorProfile, id=mentor_id)
        college = CollegeProfile.objects.get(user=request.user)

        # Check if the mentor belongs to this college
        if mentor.college != college:
            messages.error(request, 'You are not authorized to verify this mentor!')
            return redirect('college_dashboard')

        action = request.POST.get('action')
        if action == 'approve':
            mentor.verification_status = 'approved'
            messages.success(request, f'Mentor {mentor.full_name} has been approved!')
        elif action == 'reject':
            mentor.verification_status = 'rejected'
            messages.success(request, f'Mentor {mentor.full_name} has been rejected!')

        mentor.verification_date = timezone.now()
        mentor.save()

    return redirect('college_dashboard')

@login_required
def mentor_requests(request):
    profile = CollegeProfile.objects.get(user=request.user)
    # Get mentor counts by verification status
    pending_mentors = MentorProfile.objects.filter(
        college=profile,
        verification_status='pending'
    )
    pending_count = pending_mentors.count()
    verified_mentors = MentorProfile.objects.filter(
        college=profile,
        verification_status='approved'
    ).count()
    rejected_mentors = MentorProfile.objects.filter(
        college=profile,
        verification_status='rejected'
    ).count()
    
    context = {
        'profile': profile,
        'pending_mentors': pending_mentors,
        'pending_count': pending_count,
        'verified_mentors': verified_mentors,
        'rejected_mentors': rejected_mentors
    }
    return render(request, 'college/mentor_requests.html', context)

class CollegeProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing college profiles.
    """
    serializer_class = CollegeProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return all college profiles for staff users.
        For regular users, return only their own college profile.
        """
        user = self.request.user
        if user.is_staff:
            return CollegeProfile.objects.all()
        return CollegeProfile.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user when creating a new college profile.
        """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """
        Update the college profile.
        """
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def verify(self, request, pk=None):
        """
        Verify a college profile.
        Only staff users can verify profiles.
        """
        college = self.get_object()
        college.is_verified = True
        college.save()
        serializer = self.get_serializer(college)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """
        Reject a college profile.
        Only staff users can reject profiles.
        """
        college = self.get_object()
        college.is_verified = False
        college.save()
        serializer = self.get_serializer(college)
        return Response(serializer.data)

class NGOForm(ModelForm):
    class Meta:
        model = NGO
        fields = ['name', 'description', 'requirements', 'contact_person', 
                 'contact_email', 'contact_phone', 'website', 'address', 'image']

def ngo_list(request):
    """View to list all NGOs added by the college"""
    try:
        profile = CollegeProfile.objects.get(user=request.user)
        ngos = NGO.objects.filter(college=profile)
        
        context = {
            'profile': profile,
            'ngos': ngos
        }
        return render(request, 'college/ngo_list.html', context)
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_login')

@login_required
def add_ngo(request):
    """View to add a new NGO"""
    try:
        profile = CollegeProfile.objects.get(user=request.user)
        
        if request.method == 'POST':
            form = NGOForm(request.POST, request.FILES)
            if form.is_valid():
                ngo = form.save(commit=False)
                ngo.college = profile
                ngo.save()
                messages.success(request, 'NGO added successfully!')
                return redirect('ngo_list')
        else:
            form = NGOForm()
        
        context = {
            'profile': profile,
            'form': form
        }
        return render(request, 'college/add_ngo.html', context)
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_login')

@login_required
def edit_ngo(request, ngo_id):
    """View to edit an existing NGO"""
    try:
        profile = CollegeProfile.objects.get(user=request.user)
        ngo = get_object_or_404(NGO, id=ngo_id, college=profile)
        
        if request.method == 'POST':
            form = NGOForm(request.POST, request.FILES, instance=ngo)
            if form.is_valid():
                form.save()
                messages.success(request, 'NGO updated successfully!')
                return redirect('ngo_list')
        else:
            form = NGOForm(instance=ngo)
        
        context = {
            'profile': profile,
            'form': form,
            'ngo': ngo
        }
        return render(request, 'college/edit_ngo.html', context)
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_login')

@login_required
def delete_ngo(request, ngo_id):
    """View to delete an NGO"""
    try:
        profile = CollegeProfile.objects.get(user=request.user)
        ngo = get_object_or_404(NGO, id=ngo_id, college=profile)
        
        # Accept both POST and GET for deletion confirmation
        if request.method == 'POST' or request.GET.get('confirm') == 'yes':
            ngo.delete()
            messages.success(request, 'NGO deleted successfully!')
            return redirect('ngo_list')
        
        context = {
            'profile': profile,
            'ngo': ngo
        }
        return render(request, 'college/delete_ngo.html', context)
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_login')
    
@login_required
def registered_mentors(request):
    try:
        college = CollegeProfile.objects.get(user=request.user)
        
        # Get filter parameters
        status = request.GET.get('status', '')
        specialization = request.GET.get('specialization', '')
        
        # Base query
        mentors = MentorProfile.objects.filter(college=college)
        
        # Apply filters
        if status:
            mentors = mentors.filter(verification_status=status)
        if specialization:
            mentors = mentors.filter(specialization=specialization)
            
        # Get stats
        total_mentors = mentors.count()
        active_mentors = mentors.filter(verification_status='approved').count()
        pending_mentors = mentors.filter(verification_status='pending').count()
        
        # Get unique specializations for filter
        specializations = MentorProfile.objects.filter(college=college).values_list('specialization', flat=True).distinct()
        
        context = {
            'mentors': mentors,
            'total_mentors': total_mentors,
            'active_mentors': active_mentors,
            'pending_mentors': pending_mentors,
            'specializations': specializations,
            'status': status,
            'specialization': specialization,
        }
        return render(request, 'college/registered_mentors.html', context)
        
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_dashboard')
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('college_dashboard')

@login_required
def registered_students(request):
    try:
        college = CollegeProfile.objects.get(user=request.user)
        
        # Get filter parameters
        branch = request.GET.get('branch', '')
        semester = request.GET.get('semester', '')
        
        # Get all students from database
        students = StudentProfile.objects.all()
        
        # Apply filters
        if branch:
            students = students.filter(branch=branch)
        if semester:
            students = students.filter(semester=semester)
            
        # Get stats
        total_students = students.count()
        active_projects = Project.objects.filter(student__in=students).count()
        mentor_connections = MentorConnection.objects.filter(student__in=students, status='accepted').count()
        
        # Calculate average projects per student
        avg_projects = Project.objects.filter(student__in=students).values('student').annotate(
            project_count=Count('id')).aggregate(avg=Avg('project_count'))['avg'] or 0
        
        # Get unique branches and semesters for filters
        branches = StudentProfile.BRANCH_CHOICES
        semesters = range(1, 9)  # Assuming 8 semesters
        
        context = {
            'students': students,
            'total_students': total_students,
            'active_projects': active_projects,
            'mentor_connections': mentor_connections,
            'avg_projects': avg_projects,
            'branches': [b[0] for b in branches],
            'semesters': semesters,
            'selected_branch': branch,
            'selected_semester': semester,
        }
        return render(request, 'college/registered_students.html', context)
        
    except CollegeProfile.DoesNotExist:
        messages.error(request, 'College profile not found!')
        return redirect('college_dashboard')
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('college_dashboard')

@login_required
def view_collaborators(request):
    try:
        college = get_object_or_404(CollegeProfile, user=request.user)
        collaborators = CollaboratorProfile.objects.all()
        
        collaborator_data = []
        for collaborator in collaborators:
            # Get all collaboration requests by this collaborator
            collaboration_requests = CollaborationRequest.objects.filter(
                collaborator=collaborator
            ).select_related('project', 'project__student', 'project__group')
            
            # Get accepted collaborations
            accepted_collaborations = collaboration_requests.filter(status='accepted')
            
            # Get connected students and groups
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
            'college': college,
            'collaborator_data': collaborator_data,
            'total_collaborators': len(collaborators)
        }
        
        return render(request, 'college/view_collaborators.html', context)
        
    except Exception as e:
        messages.error(request, f'An error occurred: {str(e)}')
        return redirect('college_dashboard')

@login_required
def project_assessment_list(request):
    college = request.user.collegeprofile
    assessments = ProjectAssessment.objects.filter(college=college).order_by('-created_at')
    
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
        'current_status': status_filter or 'all'
    }
    return render(request, 'college/project_assessment_list.html', context)

@login_required
def add_project_assessment(request):
    if request.method == 'POST':
        college = request.user.collegeprofile
        assessment = ProjectAssessment(
            college=college,
            title=request.POST.get('title'),
            description=request.POST.get('description'),
            target_semester=request.POST.get('target_semester'),
            target_branch=request.POST.get('target_branch'),
            start_date=request.POST.get('start_date'),
            end_date=request.POST.get('end_date'),
            max_marks=request.POST.get('max_marks'),
            assessment_criteria=request.POST.get('assessment_criteria'),
            submission_required=request.POST.get('submission_required') == 'on'
        )
        
        if 'resources' in request.FILES:
            assessment.resources = request.FILES['resources']
        
        assessment.save()
        messages.success(request, 'Project assessment added successfully!')
        return redirect('project_assessment_list')
    
    context = {
        'semester_choices': ProjectAssessment.SEMESTER_CHOICES
    }
    return render(request, 'college/add_project_assessment.html', context)

@login_required
def edit_project_assessment(request, assessment_id):
    college = request.user.collegeprofile
    assessment = get_object_or_404(ProjectAssessment, id=assessment_id, college=college)
    
    if request.method == 'POST':
        try:
            assessment.title = request.POST.get('title')
            assessment.description = request.POST.get('description')
            assessment.target_semester = request.POST.get('target_semester')
            assessment.target_branch = request.POST.get('target_branch')
            assessment.start_date = request.POST.get('start_date')
            assessment.end_date = request.POST.get('end_date')
            assessment.status = request.POST.get('status')
            assessment.max_marks = request.POST.get('max_marks')
            assessment.assessment_criteria = request.POST.get('assessment_criteria')
            assessment.submission_required = bool(request.POST.get('submission_required'))
            
            if 'resources' in request.FILES:
                assessment.resources = request.FILES['resources']
            
            assessment.save()
            messages.success(request, 'Project assessment updated successfully!')
            return redirect('project_assessment_list')
            
        except Exception as e:
            messages.error(request, f'Error updating project assessment: {str(e)}')
    
    context = {
        'assessment': assessment,
        'status_choices': ProjectAssessment.STATUS_CHOICES,
        'semester_choices': ProjectAssessment.SEMESTER_CHOICES,
        'profile': college
    }
    return render(request, 'college/edit_project_assessment.html', context)

@login_required
def delete_project_assessment(request, assessment_id):
    college = request.user.collegeprofile
    assessment = get_object_or_404(ProjectAssessment, id=assessment_id, college=college)
    
    try:
        assessment.delete()
        messages.success(request, 'Project assessment deleted successfully!')
    except Exception as e:
        messages.error(request, f'Error deleting project assessment: {str(e)}')
    
    return redirect('project_assessment_list')

@login_required
def remove_mentor(request, mentor_id):
    print("yaha request aa raha hai")
    print(mentor_id)
    print(request.method)
    if request.method == 'POST':
        try:
            college = request.user.collegeprofile
            mentor = MentorProfile.objects.get(id=mentor_id, college=college)
            
            # Delete the mentor's user account and profile
            user = mentor.user
            mentor.delete()
            user.delete()
            
            messages.success(request, f'Successfully removed mentor {mentor.full_name}.')
        except MentorProfile.DoesNotExist:
            messages.error(request, 'Mentor not found or you do not have permission to remove them.')
        except Exception as e:
            messages.error(request, f'An error occurred while removing the mentor: {str(e)}')
    
    return redirect('registered_mentors')

@login_required
def remove_collaborator(request, collaborator_id):
    if request.method == 'POST':
        try:
            college = request.user.collegeprofile
            collaborator = CollaboratorProfile.objects.get(id=collaborator_id)
            
            # Check if the collaborator has any active projects with this college
            active_projects = Project.objects.filter(
                collaborator=collaborator,
                student__college=college,
                status__in=['in_progress', 'under_review']
            ).exists()
            
            if active_projects:
                messages.error(request, 'Cannot remove collaborator as they have active projects with students.')
                return redirect('college_view_collaborators')
            
            # Remove collaborator's access to college projects
            CollaborationRequest.objects.filter(
                collaborator=collaborator,
                project__student__college=college
            ).delete()
            
            messages.success(request, f'Successfully removed collaborator {collaborator.full_name} from your college.')
        except CollaboratorProfile.DoesNotExist:
            messages.error(request, 'Collaborator not found.')
        except Exception as e:
            messages.error(request, f'An error occurred while removing the collaborator: {str(e)}')
    
    return redirect('college_view_collaborators')
