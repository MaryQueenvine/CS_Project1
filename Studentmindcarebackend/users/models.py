from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings
from datetime import date, timedelta


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('therapist', 'Therapist'),
        ('admin', 'Admin'),
    ]

    uid = models.CharField(max_length=255, unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # Student-specific fields
    faculty = models.CharField(max_length=100, blank=True, null=True)
    year = models.CharField(max_length=10, blank=True, null=True)

    # Therapist-specific fields
    licenseNumber = models.CharField(max_length=100, blank=True, null=True)
    specialty = models.CharField(max_length=100, blank=True, null=True)
    experience = models.CharField(max_length=10, blank=True, null=True)

    # Shared/extra fields
    is_in_crisis = models.BooleanField(default=False)
    mood_status = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    class Meta:
        db_table = 'custom_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class Session(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_sessions')
    therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='therapist_sessions')
    scheduled_time = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username} with {self.therapist.username}"

    class Meta:
        db_table = 'session'


class ChatSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session_type = models.CharField(max_length=20, choices=[
        ('triage', 'Triage'),
        ('support', 'Support'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    is_complete = models.BooleanField(default=False)
    triage_result = models.JSONField(null=True, blank=True)


class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE)
    message = models.TextField()
    response = models.TextField()
    is_flagged = models.BooleanField(default=False)
    flag_reason = models.CharField(max_length=100, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class Therapist(models.Model):
    name = models.CharField(max_length=100)
    specialties = models.JSONField()
    max_patients = models.IntegerField(default=50)
    current_patients = models.IntegerField(default=0)


class TherapistAssignment(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    therapist = models.ForeignKey(Therapist, on_delete=models.SET_NULL, null=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    triage_score = models.JSONField()


class MoodEntry(models.Model):
    MOOD_CHOICES = [
        ('very_happy', 'Very Happy'),
        ('happy', 'Happy'),
        ('neutral', 'Neutral'),
        ('sad', 'Sad'),
        ('very_sad', 'Very Sad'),
        ('angry', 'Angry'),
        ('anxious', 'Anxious'),
        ('excited', 'Excited'),
        ('tired', 'Tired'),
        ('stressed', 'Stressed'),
    ]

    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    note = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Mood Entry'
        verbose_name_plural = 'Mood Entries'

    def __str__(self):
        return f"{self.get_mood_display()} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

    @property
    def date(self):
        return self.timestamp.date()

    @classmethod
    def get_today_entries(cls):
        today = date.today()
        return cls.objects.filter(timestamp__date=today)

    @classmethod
    def get_mood_streak(cls):
        today = date.today()
        streak = 0
        current_date = today

        while cls.objects.filter(timestamp__date=current_date).exists():
            streak += 1
            current_date -= timedelta(days=1)

        return streak

    @classmethod
    def get_mood_stats(cls, days=30):
        start_date = date.today() - timedelta(days=days)
        entries = cls.objects.filter(timestamp__date__gte=start_date)

        mood_counts = {mood: entries.filter(mood=mood).count() for mood, _ in cls.MOOD_CHOICES}

        return {
            'total_entries': entries.count(),
            'mood_counts': mood_counts,
            'days_tracked': days,
            'average_per_day': entries.count() / days if days > 0 else 0
        }


class MoodPattern(models.Model):
    date = models.DateField()
    dominant_mood = models.CharField(max_length=20)
    mood_score = models.FloatField(help_text="Average mood score for the day (1-10)")
    total_entries = models.IntegerField(default=0)
    notes_summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['date']

    def __str__(self):
        return f"{self.date} - {self.dominant_mood} (Score: {self.mood_score})"

    @classmethod
    def calculate_mood_score(cls, mood):
        mood_scores = {
            'very_sad': 1,
            'sad': 3,
            'angry': 3,
            'anxious': 4,
            'stressed': 4,
            'tired': 5,
            'neutral': 6,
            'happy': 8,
            'excited': 9,
            'very_happy': 10,
        }
        return mood_scores.get(mood, 5)

    @classmethod
    def generate_daily_pattern(cls, target_date=None):
        if target_date is None:
            target_date = date.today()

        entries = MoodEntry.objects.filter(timestamp__date=target_date)
        if not entries.exists():
            return None

        mood_counts = {}
        total_score = 0

        for entry in entries:
            mood_counts[entry.mood] = mood_counts.get(entry.mood, 0) + 1
            total_score += cls.calculate_mood_score(entry.mood)

        dominant_mood = max(mood_counts, key=mood_counts.get)
        average_score = total_score / entries.count()
        notes_summary = " | ".join([entry.note for entry in entries if entry.note]) or ""

        pattern, created = cls.objects.get_or_create(
            date=target_date,
            defaults={
                'dominant_mood': dominant_mood,
                'mood_score': round(average_score, 2),
                'total_entries': entries.count(),
                'notes_summary': notes_summary
            }
        )

        if not created:
            pattern.dominant_mood = dominant_mood
            pattern.mood_score = round(average_score, 2)
            pattern.total_entries = entries.count()
            pattern.notes_summary = notes_summary
            pattern.save()

        return pattern


class Resource(models.Model):
    title = models.CharField(max_length=200)
    link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
