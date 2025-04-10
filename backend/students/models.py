from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class StudentProfile(models.Model):
    SECTION_CHOICES = [
        ('A', 'Section A'),
        ('B', 'Section B'),
        ('C', 'Section C'),
        ('D', 'Section D'),
    ]
    
    BRANCH_CHOICES = [
        ('CSE', 'Computer Science'),
        ('IT', 'Information Technology'),
        ('ECE', 'Electronics & Communication'),
        ('EEE', 'Electrical & Electronics'),
        ('MECH', 'Mechanical'),
        ('CIVIL', 'Civil'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    
    # Academic Information
    roll_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    branch = models.CharField(max_length=10, choices=BRANCH_CHOICES, null=True, blank=True)
    section = models.CharField(max_length=1, choices=SECTION_CHOICES, null=True, blank=True)
    semester = models.IntegerField(null=True, blank=True)
    admission_year = models.IntegerField(null=True, blank=True)
    
    # Additional Information
    address = models.TextField(null=True, blank=True)
    parent_name = models.CharField(max_length=100, null=True, blank=True)
    parent_phone = models.CharField(max_length=15, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

# Signal to create/update student profile when user is created/updated
@receiver(post_save, sender=User)
def create_or_update_student_profile(sender, instance, created, **kwargs):
    if created:
        StudentProfile.objects.create(user=instance)
    else:
        try:
            instance.student_profile.save()
        except StudentProfile.DoesNotExist:
            StudentProfile.objects.create(user=instance)
