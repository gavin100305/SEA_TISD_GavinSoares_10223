from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import CollegeProfile
from mentor.models import MentorProfile
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import CollegeProfileSerializer

def college_signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        email = request.POST.get('email')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists!')
            return redirect('college_signup')

        user = User.objects.create_user(username=username, password=password1, email=email)
        # Profile will be created by the signal
        login(request, user)
        messages.success(request, 'Account created successfully!')
        return redirect('college_dashboard')

    return render(request, 'college_signup.html')

def college_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            # Profile existence is handled by the signal
            return redirect('college_dashboard')
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
        # Get pending mentor verification requests for this college
        pending_mentors = MentorProfile.objects.filter(
            college=profile,
            verification_status='pending'
        )
        
        context = {
            'profile': profile,
            'pending_mentors': pending_mentors,
            'total_students': profile.total_students,
            'total_faculty': profile.total_faculty,
            'total_courses': 0  # You can update this when you add courses
        }
        return render(request, 'college_dashboard.html', context)
    except CollegeProfile.DoesNotExist:
        profile = CollegeProfile.objects.create(user=request.user)
        return render(request, 'college_dashboard.html', {'profile': profile})

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
