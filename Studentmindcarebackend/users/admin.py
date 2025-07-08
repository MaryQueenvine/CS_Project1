from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Session
from django.utils.html import format_html
from django.db.models import Count
from django.urls import reverse
from .models import MoodEntry, MoodPattern


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

@admin.register(MoodEntry)
class MoodEntryAdmin(admin.ModelAdmin):
    list_display = ['mood_display_icon', 'mood', 'timestamp', 'date', 'has_note', 'created_at']
    list_filter = ['mood', 'timestamp', 'created_at']
    search_fields = ['mood', 'note']
    readonly_fields = ['created_at', 'updated_at', 'date']
    date_hierarchy = 'timestamp'
    ordering = ['-timestamp']

    fieldsets = (
        ('Mood Information', {
            'fields': ('mood', 'timestamp', 'note')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def mood_display_icon(self, obj):
        """Display mood with icon"""
        mood_icons = {
            'very_happy': '😄',
            'happy': '😊',
            'neutral': '😐',
            'sad': '😢',
            'very_sad': '😭',
            'angry': '😡',
            'anxious': '😰',
            'excited': '🤩',
            'tired': '😴',
            'stressed': '😵',
        }
        icon = mood_icons.get(obj.mood, '❓')
        return format_html(f'{icon} {obj.get_mood_display()}')

    mood_display_icon.short_description = 'Mood'
    mood_display_icon.admin_order_field = 'mood'

    def has_note(self, obj):
        """Show if entry has a note"""
        return bool(obj.note and obj.note.strip())

    has_note.boolean = True
    has_note.short_description = 'Has Note'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related()

    actions = ['export_as_csv']

    def export_as_csv(self, request, queryset):
        """Export selected entries as CSV"""
        import csv
        from django.http import HttpResponse

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="mood_entries.csv"'

        writer = csv.writer(response)
        writer.writerow(['Date', 'Time', 'Mood', 'Note'])

        for entry in queryset:
            writer.writerow([
                entry.timestamp.date(),
                entry.timestamp.time(),
                entry.get_mood_display(),
                entry.note or ''
            ])

        return response

    export_as_csv.short_description = "Export selected entries as CSV"


@admin.register(MoodPattern)
class MoodPatternAdmin(admin.ModelAdmin):
    list_display = ['date', 'dominant_mood_icon', 'mood_score', 'total_entries', 'created_at']
    list_filter = ['dominant_mood', 'date', 'created_at']
    search_fields = ['dominant_mood', 'notes_summary']
    readonly_fields = ['created_at']
    date_hierarchy = 'date'
    ordering = ['-date']

    fieldsets = (
        ('Pattern Information', {
            'fields': ('date', 'dominant_mood', 'mood_score', 'total_entries')
        }),
        ('Notes Summary', {
            'fields': ('notes_summary',),
            'classes': ('wide',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def dominant_mood_icon(self, obj):
        """Display dominant mood with icon"""
        mood_icons = {
            'very_happy': '😄',
            'happy': '😊',
            'neutral': '😐',
            'sad': '😢',
            'very_sad': '😭',
            'angry': '😡',
            'anxious': '😰',
            'excited': '🤩',
            'tired': '😴',
            'stressed': '😵',
        }
        icon = mood_icons.get(obj.dominant_mood, '❓')
        return format_html(f'{icon} {obj.get_dominant_mood_display()}')

    dominant_mood_icon.short_description = 'Dominant Mood'
    dominant_mood_icon.admin_order_field = 'dominant_mood'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


# Custom admin views for analytics
class MoodAnalyticsAdmin(admin.ModelAdmin):
    """Custom admin view for mood analytics"""

    def changelist_view(self, request, extra_context=None):
        # Add analytics data to the context
        from datetime import date, timedelta

        today = date.today()
        last_30_days = today - timedelta(days=30)

        # Get basic stats
        total_entries = MoodEntry.objects.count()
        recent_entries = MoodEntry.objects.filter(timestamp__date__gte=last_30_days).count()
        streak = MoodEntry.get_mood_streak()

        # Get mood distribution
        mood_counts = MoodEntry.objects.values('mood').annotate(count=Count('mood')).order_by('-count')

        # Get daily patterns
        recent_patterns = MoodPattern.objects.filter(date__gte=last_30_days).order_by('-date')[:10]

        extra_context = extra_context or {}
        extra_context.update({
            'total_entries': total_entries,
            'recent_entries': recent_entries,
            'current_streak': streak,
            'mood_distribution': mood_counts,
            'recent_patterns': recent_patterns,
        })

        return super().changelist_view(request, extra_context=extra_context)


# Register the analytics view
#admin.site.register(MoodEntry, MoodEntryAdmin)
#admin.site.register(MoodPattern, MoodPatternAdmin)

# Customize admin site header
admin.site.site_header = "Mood Tracker Admin"
admin.site.site_title = "Mood Tracker"
admin.site.index_title = "Welcome to Mood Tracker Administration"