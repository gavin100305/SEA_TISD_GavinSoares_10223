from django.contrib import admin
from .models import StudentProfile

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'roll_number', 'branch', 'section')
    search_fields = ('user__username', 'full_name', 'roll_number', 'branch')
    list_filter = ('branch', 'section', 'semester', 'created_at')
