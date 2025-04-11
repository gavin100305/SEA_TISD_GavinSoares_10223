from django.db import models
from django.contrib.auth.models import User

class CollegeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    college_name = models.CharField(max_length=200, blank=True, null=True)
    college_code = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    established_year = models.IntegerField(blank=True, null=True)
    principal_name = models.CharField(max_length=100, blank=True, null=True)
    principal_email = models.EmailField(blank=True, null=True)
    total_students = models.IntegerField(default=0)
    total_faculty = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.college_name or 'Unnamed College'} - {self.college_code or 'No Code'}"

class NGO(models.Model):
    college = models.ForeignKey(CollegeProfile, on_delete=models.CASCADE, related_name='ngos')
    name = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField(help_text="What the NGO needs or is looking for")
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='ngo_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
