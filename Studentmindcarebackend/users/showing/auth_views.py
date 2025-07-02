from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializer import UserSerializer
import logging
from ..models import CustomUser

logger = logging.getLogger(__name__)
User = get_user_model()

@api_view(['POST'])
def register_user(request):
    logger.info("Received registration data: %s", request.data)  # Log incoming data

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info("User registered successfully: %s", serializer.data)  # Log success
        return Response({'message': 'User registered successfully!'}, status=201)

    logger.warning("Registration failed with errors: %s", serializer.errors)  # Log errors
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        return Response({'message': 'Login successful', 'role': user.role})
    return Response({'error': 'Invalid credentials'}, status=401)