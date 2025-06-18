from django.db import models
from django.contrib.auth.models import AbstractUser

class Profile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mood_status = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_in_crisis = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Therapist(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Session(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    therapist = models.ForeignKey(Therapist, on_delete=models.CASCADE)
    scheduled_time = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.student.name} with {self.therapist.name}"


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('therapist', 'Therapist'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return self.username  # changed from self.name
