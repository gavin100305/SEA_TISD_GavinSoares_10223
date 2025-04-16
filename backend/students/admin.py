from django.contrib import admin
from .models import (
    StudentProfile,
    StudentGroup,
    GroupMembership,
    MentorConnection,
    Project,
    CollaborationRequest,
    ProjectComment,
)

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'roll_number', 'branch', 'section', 'semester')
    search_fields = ('user__username', 'full_name', 'roll_number', 'branch')
    list_filter = ('branch', 'section', 'semester', 'created_at')


@admin.register(StudentGroup)
class StudentGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'leader', 'created_at')
    search_fields = ('name', 'leader__full_name')
    list_filter = ('created_at',)


@admin.register(GroupMembership)
class GroupMembershipAdmin(admin.ModelAdmin):
    list_display = ('student', 'group', 'status', 'joined_at')
    search_fields = ('student__full_name', 'group__name')
    list_filter = ('status', 'joined_at')


@admin.register(MentorConnection)
class MentorConnectionAdmin(admin.ModelAdmin):
    list_display = ('student', 'mentor', 'status', 'created_at')
    search_fields = ('student__full_name', 'mentor__full_name')
    list_filter = ('status', 'created_at')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'student', 'group', 'mentor', 'status', 'is_open_for_collaboration', 'created_at')
    search_fields = ('title', 'student__full_name', 'group__name', 'mentor__full_name')
    list_filter = ('status', 'is_open_for_collaboration', 'collaborator', 'created_at')


@admin.register(CollaborationRequest)
class CollaborationRequestAdmin(admin.ModelAdmin):
    list_display = ('project', 'collaborator', 'status', 'created_at')
    search_fields = ('project__title', 'collaborator__full_name')
    list_filter = ('status', 'created_at')


@admin.register(ProjectComment)
class ProjectCommentAdmin(admin.ModelAdmin):
    list_display = ('project', 'get_author_name', 'author_type', 'created_at')
    search_fields = ('project__title', 'content')
    list_filter = ('author_type', 'created_at')

    def get_author_name(self, obj):
        return obj.get_author_name()
    get_author_name.short_description = 'Author'
