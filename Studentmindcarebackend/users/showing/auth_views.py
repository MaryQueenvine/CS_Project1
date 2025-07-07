from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from ..serializer import UserSerializer
from ..models import CustomUser
import logging
from rest_framework.parsers import MultiPartParser, FormParser


logger = logging.getLogger(__name__)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def register_user(request):
    try:
        logger.info("Received registration data: %s", request.data)

        # Validate required fields
        required_fields = ['uid', 'username', 'email', 'first_name', 'role']
        missing_fields = [field for field in required_fields if not request.data.get(field)]

        if missing_fields:
            logger.warning("Missing required fields: %s", missing_fields)
            return Response({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists
        if CustomUser.objects.filter(uid=request.data.get('uid')).exists():
            logger.warning("User with UID %s already exists", request.data.get('uid'))
            return Response({
                'error': 'User with this Firebase UID already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=request.data.get('email')).exists():
            logger.warning("User with email %s already exists", request.data.get('email'))
            return Response({
                'error': 'User with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        license_file = request.FILES.get('licenseFile')  # optional

        # Create user using serializer
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info("User registered successfully: %s (ID: %s)", user.username, user.id)

            return Response({
                'message': 'User registered successfully!',
                'user_id': user.id,
                'username': user.username,
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        else:
            logger.warning("Serializer validation failed: %s", serializer.errors)
            return Response({
                'error': 'Validation failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error("Unexpected error during registration: %s", str(e))
        return Response({
            'error': 'Internal server error',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user:
            logger.info("User %s logged in successfully", username)
            return Response({
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username,
                'role': user.role,
                'email': user.email
            }, status=status.HTTP_200_OK)
        else:
            logger.warning("Failed login attempt for username: %s", username)
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        logger.error("Unexpected error during login: %s", str(e))
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_role(request, uid):
    """
    Get user role by Firebase UID
    """
    logger.info(f"Getting user role for UID: {uid}")

    try:
        user = CustomUser.objects.get(uid=uid)
        logger.info(f"User found: {user.email} with role: {user.role}")

        return Response({
            'role': user.role,
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'faculty': user.faculty,
            'year': user.year
        }, status=status.HTTP_200_OK)

    except CustomUser.DoesNotExist:
        logger.error(f"User not found for UID: {uid}")
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error getting user role: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)