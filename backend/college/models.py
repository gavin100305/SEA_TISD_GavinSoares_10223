from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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

@receiver(post_save, sender=User)
def create_college_profile(sender, instance, created, **kwargs):
    if created:
        CollegeProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_college_profile(sender, instance, **kwargs):
    try:
        if hasattr(instance, 'collegeprofile'):
            instance.collegeprofile.save()
    except CollegeProfile.DoesNotExist:
        CollegeProfile.objects.create(user=instance)
