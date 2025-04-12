from django.db import models
from django.contrib.auth.models import User
from college.models import CollegeProfile

class MentorProfile(models.Model):
    VERIFICATION_STATUS = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    full_name = models.CharField(max_length=200, blank=True, null=True)
    college = models.ForeignKey('college.CollegeProfile', on_delete=models.SET_NULL, related_name='mentors', null=True, blank=True)
    profile_picture = models.ImageField(upload_to='mentor_profiles/', null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    highest_qualification = models.CharField(max_length=200, blank=True, null=True)
    university = models.CharField(max_length=200, blank=True, null=True)
    specialization = models.CharField(max_length=200, blank=True, null=True)
    current_role = models.CharField(max_length=200, blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    teaching_branch = models.CharField(max_length=200, blank=True, null=True)
    expertise_areas = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='pending')
    verification_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name or self.user.username} - {self.get_verification_status_display()}"

class ZoomMeeting(models.Model):
    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name='scheduled_meetings')
    student = models.ForeignKey('students.StudentProfile', on_delete=models.CASCADE, related_name='mentor_meetings')
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    meeting_link = models.URLField()
    meeting_time = models.DateTimeField()
    duration = models.IntegerField(help_text='Duration in minutes')
    status = models.CharField(max_length=20, choices=[
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-meeting_time']

    def __str__(self):
        return f"Meeting: {self.mentor.full_name} with {self.student.full_name} on {self.meeting_time}"
