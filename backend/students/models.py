from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from mentor.models import MentorProfile
from django.core.validators import MinValueValidator, MaxValueValidator
from college.models import CollegeProfile

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
    profile_picture = models.ImageField(upload_to='student_profiles/', null=True, blank=True)
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

class StudentGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    leader = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='led_groups')
    members = models.ManyToManyField(StudentProfile, through='GroupMembership', related_name='groups')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (Led by {self.leader.full_name})"

    class Meta:
        ordering = ['-created_at']

class GroupMembership(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    group = models.ForeignKey(StudentGroup, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    joined_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'group')
        ordering = ['-joined_at']

    def __str__(self):
        return f"{self.student.full_name} in {self.group.name}"

class MentorConnection(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='mentor_connections')
    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name='student_connections')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'mentor')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.full_name} -> {self.mentor.full_name} ({self.status})"

class Project(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='projects', null=True, blank=True)
    group = models.ForeignKey(StudentGroup, on_delete=models.CASCADE, related_name='group_projects', null=True, blank=True)
    mentor = models.ForeignKey('mentor.MentorProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='guided_projects')
    college = models.ForeignKey(CollegeProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='college_projects')
    collaborator = models.BooleanField(default=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    sdgs = models.CharField(max_length=500, help_text='Sustainable Development Goals')
    tech_stack = models.CharField(max_length=500, help_text='Technologies used')
    github_link = models.URLField(blank=True, null=True)
    project_file = models.FileField(upload_to='project_files/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('under_review', 'Under Review')
    ], default='in_progress')
    mentor_feedback = models.TextField(blank=True, null=True)
    mentor_grade = models.IntegerField(blank=True, null=True, validators=[
        MinValueValidator(0),
        MaxValueValidator(100)
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.group:
            return f"{self.title} by {self.group.name}"
        return f"{self.title} by {self.student.full_name}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.student and not self.group:
            raise ValidationError('A project must have either a student or a group')
        if self.student and self.group:
            raise ValidationError('A project cannot have both a student and a group')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
