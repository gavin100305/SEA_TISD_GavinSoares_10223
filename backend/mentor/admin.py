from django.contrib import admin
from .models import MentorProfile, ZoomMeeting,GitHubStats

@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'full_name', 'college', 'current_role', 'specialization',
        'experience_years', 'verification_status', 'created_at'
    )
    search_fields = (
        'user__username', 'full_name', 'phone', 'specialization',
        'current_role', 'university'
    )
    list_filter = (
        'verification_status', 'college', 'experience_years',
        'created_at', 'updated_at'
    )
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User Info', {
            'fields': ('user', 'full_name', 'college', 'profile_picture', 'phone')
        }),
        ('Academic & Professional Info', {
            'fields': (
                'highest_qualification', 'university', 'specialization',
                'current_role', 'experience_years', 'teaching_branch',
                'expertise_areas'
            )
        }),
        ('Verification & Socials', {
            'fields': (
                'bio', 'linkedin', 'website', 'verification_status',
                'verification_date'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(ZoomMeeting)
class ZoomMeetingAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'mentor', 'student', 'meeting_time', 'duration',
        'status', 'created_at'
    )
    search_fields = (
        'title', 'mentor__full_name', 'mentor__user__username',
        'student__full_name', 'student__user__username'
    )
    list_filter = (
        'status', 'meeting_time', 'mentor', 'student'
    )
    ordering = ('-meeting_time',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Meeting Info', {
            'fields': ('title', 'description', 'mentor', 'student')
        }),
        ('Schedule Details', {
            'fields': ('meeting_link', 'meeting_time', 'duration', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(GitHubStats)
class GitHubStatsAdmin(admin.ModelAdmin):
    list_display = ('project', 'stars', 'forks', 'watchers', 'last_updated')
    readonly_fields = ('last_updated',)