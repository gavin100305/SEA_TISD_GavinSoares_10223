from django.contrib import admin
from .models import CollegeProfile

@admin.register(CollegeProfile)
class CollegeProfileAdmin(admin.ModelAdmin):
    list_display = ('college_name', 'college_code', 'principal_name', 'contact_number')
    search_fields = ('college_name', 'college_code', 'principal_name')
    list_filter = ('established_year', 'created_at')
