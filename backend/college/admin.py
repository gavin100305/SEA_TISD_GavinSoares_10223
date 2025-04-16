from django.contrib import admin
from .models import CollegeProfile, NGO, ProjectAssessment

@admin.register(CollegeProfile)
class CollegeProfileAdmin(admin.ModelAdmin):
    list_display = ('college_name', 'college_code', 'principal_name', 'contact_number', 'total_students', 'total_faculty', 'established_year')
    search_fields = ('college_name', 'college_code', 'principal_name', 'principal_email')
    list_filter = ('established_year', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'college_name', 'college_code', 'address')
        }),
        ('Contact Info', {
            'fields': ('contact_number', 'website')
        }),
        ('Administration', {
            'fields': ('established_year', 'principal_name', 'principal_email')
        }),
        ('Stats', {
            'fields': ('total_students', 'total_faculty')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(NGO)
class NGOAdmin(admin.ModelAdmin):
    list_display = ('name', 'college', 'contact_person', 'contact_email', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at', 'college')
    search_fields = ('name', 'description', 'requirements', 'contact_person', 'contact_email')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('college', 'name', 'description', 'requirements', 'image')
        }),
        ('Contact Information', {
            'fields': ('contact_person', 'contact_email', 'contact_phone', 'website', 'address')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

@admin.register(ProjectAssessment)
class ProjectAssessmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'college', 'target_semester', 'target_branch', 'start_date', 'end_date', 'status', 'submission_required')
    list_filter = ('status', 'target_semester', 'target_branch', 'college', 'submission_required', 'created_at')
    search_fields = ('title', 'description', 'assessment_criteria')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Details', {
            'fields': ('college', 'title', 'description', 'target_semester', 'target_branch')
        }),
        ('Schedule', {
            'fields': ('start_date', 'end_date', 'status')
        }),
        ('Assessment Info', {
            'fields': ('max_marks', 'assessment_criteria', 'resources', 'submission_required')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
