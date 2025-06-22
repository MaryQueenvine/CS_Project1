from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response


User = get_user_model()

@api_view(['POST'])
def register_user(request):
    data = request.data
    user = User(
        username=data['username'],
        email=data['email'],
        role=data['role']
    )
    user.set_password(data['password'])  # password hashing
    user.save()
    return Response({'message': 'User registered successfully'})


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        return Response({'message': 'Login successful', 'role': user.role})
    return Response({'error': 'Invalid credentials'}, status=401)