from django.contrib import admin
from .models import CollegeProfile, NGO

@admin.register(CollegeProfile)
class CollegeProfileAdmin(admin.ModelAdmin):
    list_display = ('college_name', 'college_code', 'principal_name', 'contact_number')
    search_fields = ('college_name', 'college_code', 'principal_name')
    list_filter = ('established_year', 'created_at')

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