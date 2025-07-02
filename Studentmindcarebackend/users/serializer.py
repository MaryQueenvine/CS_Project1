from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'uid',
            'username',
            'email',
            'role',
            'faculty',
            'year',
            'licenseNumber',
            'specialty',
            'experience'
        ]
        extra_kwargs = {
            'username': {'required': False},  # We can auto-fill username if empty
        }

    def create(self, validated_data):
        # Auto-assign username if not provided
        username = validated_data.get('username') or validated_data.get('email')
        validated_data['username'] = username
        return super().create(validated_data)
