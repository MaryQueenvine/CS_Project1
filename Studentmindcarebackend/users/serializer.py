from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, required=False)  # Make password optional

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
            'experience'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},  # Explicitly set as not required
            'username': {'required': False},
            'id': {'read_only': True},
        }

    def validate_email(self, value):
        """Ensure email is unique"""
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_uid(self, value):
        """Ensure Firebase UID is unique"""
        if CustomUser.objects.filter(uid=value).exists():
            raise serializers.ValidationError("A user with this UID already exists.")
        return value

    def validate_role(self, value):
        """Validate role is one of the allowed choices"""
        allowed_roles = ['student', 'therapist', 'admin']
        if value.lower() not in allowed_roles:
            raise serializers.ValidationError(f"Role must be one of: {', '.join(allowed_roles)}")
        return value.lower()

    def validate(self, attrs):
        """Cross-field validation"""
        role = attrs.get('role', '').lower()

        # Check if this is a Firebase user (has uid) vs regular Django user
        has_uid = attrs.get('uid')
        has_password = attrs.get('password')

        # For non-Firebase users (no uid), password is required
        if not has_uid and not has_password:
            raise serializers.ValidationError({
                'password': 'Password is required for non-Firebase authentication.'
            })

        # Validate student-specific fields
        if role == 'student':
            if not attrs.get('faculty'):
                raise serializers.ValidationError({'faculty': 'Faculty is required for students.'})
            if not attrs.get('year'):
                raise serializers.ValidationError({'year': 'Year of study is required for students.'})

        # Validate therapist-specific fields
        elif role == 'therapist':
            if not attrs.get('licenseNumber'):
                raise serializers.ValidationError({'licenseNumber': 'License number is required for therapists.'})
            if not attrs.get('specialty'):
                raise serializers.ValidationError({'specialty': 'Specialty is required for therapists.'})
            if not attrs.get('experience'):
                raise serializers.ValidationError({'experience': 'Years of experience is required for therapists.'})

        return attrs

    def create(self, validated_data):
        # Auto-assign username if not provided (use email)
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']

        # Extract password (may be None for Firebase users)
        password = validated_data.pop('password', None)

        # Create user instance
        user = CustomUser.objects.create(**validated_data)

        # Set password based on authentication method
        if password:
            # Regular Django authentication - set the provided password
            user.set_password(password)
        else:
            # Firebase authentication - set unusable password
            user.set_unusable_password()

        user.save()
        return user

    def update(self, instance, validated_data):
        # Handle password update separately
        password = validated_data.pop('password', None)

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update password if provided
        if password:
            instance.set_password(password)

        instance.save()
        return instance