from django.db import models
from django.contrib.auth.models import User
from college.models import CollegeProfile
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from students.models import Project



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
    
    def send_notification_emails(self, notification_type='scheduled'):
        """Send notification emails to both mentor and student"""
        if notification_type == 'scheduled':
            subject = f"New Meeting Scheduled: {self.title}"
            template = 'emails/meeting_scheduled.html'
        elif notification_type == 'updated':
            subject = f"Meeting Updated: {self.title}"
            template = 'emails/meeting_updated.html'
        elif notification_type == 'cancelled':
            subject = f"Meeting Cancelled: {self.title}"
            template = 'emails/meeting_cancelled.html'
        else:
            return
        
        # Context for email template
        context = {
            'meeting': self,
            'mentor_name': self.mentor.full_name or self.mentor.user.username,
            'student_name': self.student.full_name or self.student.user.username,
        }
        
        # Render email content from template
        html_message = render_to_string(template, context)
        plain_message = strip_tags(html_message)
        
        # Get recipient email addresses
        mentor_email = self.mentor.user.email
        student_email = self.student.user.email
        
        # Send emails
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[mentor_email, student_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return True
    

# models.py
class GitHubStats(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='github_stats')
    stars = models.IntegerField(default=0)
    forks = models.IntegerField(default=0)
    watchers = models.IntegerField(default=0)
    contributors = models.JSONField(default=dict)  # Stores {'username': commit_count}
    languages = models.JSONField(default=dict)    # Stores {'language': percentage}
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"GitHub Stats for {self.project.title}"