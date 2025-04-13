from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class CollaboratorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='collaborator_profile')
    full_name = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='collaborator_profiles/', null=True, blank=True)
    expertise = models.CharField(max_length=200, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    experience_years = models.IntegerField(default=0, null=True, blank=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_profile_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Collaborator Profile"
        verbose_name_plural = "Collaborator Profiles"

    def __str__(self):
        return self.full_name or self.user.username

    def save(self, *args, **kwargs):
        # Convert empty strings to None for all nullable fields
        for field in ['full_name', 'expertise', 'company', 'position', 'bio', 'phone',
                     'linkedin_url', 'github_url', 'portfolio_url']:
            value = getattr(self, field)
            if isinstance(value, str) and not value.strip():
                setattr(self, field, None)

        # Check if required fields are filled to mark profile as complete
        required_fields_filled = all([
            self.full_name,
            self.expertise,
            self.position,
            self.bio,
            isinstance(self.experience_years, int)
        ])

        self.is_profile_complete = required_fields_filled
        super().save(*args, **kwargs)
