from rest_framework import serializers
from .models import CustomUser, MoodEntry, MoodPattern, Resource
from django.contrib.auth.hashers import make_password


# === User Serializer ===
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, required=False)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'uid',
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'role',
            'faculty',
            'year',
            'licenseNumber',
            'specialty',
            'experience',
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
            'id': {'read_only': True},
        }

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_uid(self, value):
        if CustomUser.objects.filter(uid=value).exists():
            raise serializers.ValidationError("A user with this UID already exists.")
        return value

    def validate_role(self, value):
        allowed_roles = ['student', 'therapist', 'admin']
        if value.lower() not in allowed_roles:
            raise serializers.ValidationError(f"Role must be one of: {', '.join(allowed_roles)}")
        return value.lower()

    def validate(self, attrs):
        role = attrs.get('role', '').lower()
        has_uid = attrs.get('uid')
        has_password = attrs.get('password')

        if not has_uid and not has_password:
            raise serializers.ValidationError({
                'password': 'Password is required for non-Firebase authentication.'
            })

        if role == 'student':
            if not attrs.get('faculty'):
                raise serializers.ValidationError({'faculty': 'Faculty is required for students.'})
            if not attrs.get('year'):
                raise serializers.ValidationError({'year': 'Year of study is required for students.'})

        elif role == 'therapist':
            if not attrs.get('licenseNumber'):
                raise serializers.ValidationError({'licenseNumber': 'License number is required for therapists.'})
            if not attrs.get('specialty'):
                raise serializers.ValidationError({'specialty': 'Specialty is required for therapists.'})
            if not attrs.get('experience'):
                raise serializers.ValidationError({'experience': 'Years of experience is required for therapists.'})

        return attrs

    def create(self, validated_data):
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']

        password = validated_data.pop('password', None)
        user = CustomUser.objects.create(**validated_data)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


# === MoodEntry Serializer ===
class MoodEntrySerializer(serializers.ModelSerializer):
    mood_display = serializers.CharField(source='get_mood_display', read_only=True)
    date = serializers.DateField(read_only=True)

    class Meta:
        model = MoodEntry
        fields = ['id', 'mood', 'mood_display', 'note', 'timestamp', 'date', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_mood(self, value):
        valid_moods = [choice[0] for choice in MoodEntry.MOOD_CHOICES]
        if value not in valid_moods:
            raise serializers.ValidationError(f"Invalid mood. Must be one of: {valid_moods}")
        return value

    def validate_note(self, value):
        if value and len(value) > 1000:
            raise serializers.ValidationError("Note cannot exceed 1000 characters")
        return value


# === MoodPattern Serializer ===
class MoodPatternSerializer(serializers.ModelSerializer):
    dominant_mood_display = serializers.CharField(source='get_dominant_mood_display', read_only=True)

    class Meta:
        model = MoodPattern
        fields = [
            'id', 'date', 'dominant_mood', 'dominant_mood_display',
            'mood_score', 'total_entries', 'notes_summary', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# === Mood Stats / Insights (Non-model Serializers) ===
class MoodStatsSerializer(serializers.Serializer):
    total_entries = serializers.IntegerField()
    mood_counts = serializers.DictField()
    days_tracked = serializers.IntegerField()
    average_per_day = serializers.FloatField()
    streak = serializers.IntegerField()


class MoodInsightsSerializer(serializers.Serializer):
    most_common_mood = serializers.CharField()
    mood_trend = serializers.CharField()  # 'improving', 'declining', 'stable'
    best_day = serializers.DateField()
    challenging_day = serializers.DateField()
    weekly_average = serializers.FloatField()
    monthly_average = serializers.FloatField()
    recommendations = serializers.ListField(child=serializers.CharField())


# === Therapist Resource Serializer ===
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'title', 'link', 'created_at', 'uploaded_by']
