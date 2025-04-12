from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import CollegeProfile,NGO
from mentor.models import MentorProfile
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import CollegeProfileSerializer
from django.forms import ModelForm
from django.db.models import Count, Avg
from students.models import StudentProfile, Project, MentorConnection


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
        
        context = {
            'profile': profile,
            'pending_mentors': pending_mentors,
            'pending_count': pending_count,
            'verified_mentors': verified_mentors,
            'rejected_mentors': rejected_mentors,
            'total_students': profile.total_students,
            'total_faculty': profile.total_faculty,
            'total_courses': 0  # You can update this when you add courses
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
        
        if request.method == 'POST':
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
