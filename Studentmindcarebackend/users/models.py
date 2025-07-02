from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('therapist', 'Therapist'),
        ('admin', 'Admin'),
    ]

    # Firebase UID for authentication
    uid = models.CharField(max_length=255, unique=True, db_index=True)

    # Role-based fields
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # Student-specific fields
    faculty = models.CharField(max_length=100, blank=True, null=True)
    year = models.CharField(max_length=10, blank=True, null=True)

    # Therapist-specific fields
    licenseNumber = models.CharField(max_length=100, blank=True, null=True)
    specialty = models.CharField(max_length=100, blank=True, null=True)
    experience = models.CharField(max_length=10, blank=True, null=True)

    # Additional fields
    is_in_crisis = models.BooleanField(default=False)
    mood_status = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    class Meta:
        db_table = 'custom_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'


# Keep existing models if they're being used elsewhere
class Session(models.Model):
    student = models.ForeignKey(
        CustomUser,on_delete=models.CASCADE, related_name='student_sessions'
    )
    therapist = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='therapist_sessions'
    )
    scheduled_time = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username} with {self.therapist.username}"

    class Meta:
        db_table = 'session'