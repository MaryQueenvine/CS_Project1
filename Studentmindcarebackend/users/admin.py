from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Session


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Customize the admin interface for CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'uid')
    ordering = ('date_joined',)

    # custom fields to the user admin form
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('uid', 'role', 'faculty', 'year', 'licenseNumber', 'specialty', 'experience')
        }),
    )

    # custom fields to the add user form
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {
            'fields': ('uid', 'role', 'faculty', 'year', 'licenseNumber', 'specialty', 'experience')
        }),
    )


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('student', 'therapist', 'scheduled_time')
    list_filter = ('scheduled_time',)
    search_fields = ('student__username', 'therapist__username')
    raw_id_fields = ('student', 'therapist')  # Makes it easier to select users
