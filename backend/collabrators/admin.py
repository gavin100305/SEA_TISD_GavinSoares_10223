from django.contrib import admin
from .models import CollaboratorProfile, ZoomMeeting

@admin.register(CollaboratorProfile)
class CollaboratorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'company', 'position', 'experience_years', 'is_profile_complete', 'created_at')
    list_filter = ('is_profile_complete', 'created_at', 'updated_at')
    search_fields = ('user__username', 'full_name', 'company', 'expertise', 'position', 'bio')
    readonly_fields = ('created_at', 'updated_at', 'is_profile_complete', 'profile_picture_preview')
    
    def profile_picture_preview(self, obj):
        if obj.profile_picture:
            return f'<img src="{obj.profile_picture.url}" width="100" height="100" style="object-fit:cover;" />'
        return "No Image"
    profile_picture_preview.allow_tags = True
    profile_picture_preview.short_description = 'Profile Picture'

    fieldsets = (
        ('User Info', {
            'fields': ('user', 'full_name', 'profile_picture', 'profile_picture_preview')
        }),
        ('Professional Info', {
            'fields': ('expertise', 'company', 'position', 'experience_years', 'bio')
        }),
        ('Links & Contact', {
            'fields': ('linkedin_url', 'github_url', 'portfolio_url', 'phone')
        }),
        ('Status & Timestamps', {
            'fields': ('is_profile_complete', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

@admin.register(ZoomMeeting)
class ZoomMeetingAdmin(admin.ModelAdmin):
    list_display = ('meeting_title', 'collaborator', 'student', 'project', 'scheduled_time', 'duration', 'status')
    list_filter = ('status', 'scheduled_time', 'created_at')
    search_fields = ('meeting_title', 'meeting_description', 'zoom_meeting_id', 'zoom_link', 'student__user__username', 'collaborator__user__username')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Meeting Info', {
            'fields': ('meeting_title', 'meeting_description', 'collaborator', 'student', 'project')
        }),
        ('Zoom Details', {
            'fields': ('scheduled_time', 'duration', 'zoom_link', 'zoom_meeting_id', 'zoom_password')
        }),
        ('Status & Timestamps', {
            'fields': ('status', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
