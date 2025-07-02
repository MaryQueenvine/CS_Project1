from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser   # Import the CustomUser  model
from .serializer import UserSerializer

def home_view(request):
    return HttpResponse("<h1>Welcome to StudentMindCare Backend</h1>")

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User  registered successfully!'}, status=201)
    return Response(serializer.errors, status=400)  # This line should be outside the if block

@api_view(['GET'])
def get_user_role(request, uid):
    try:
        user = CustomUser.objects.get(uid=uid)
        return Response({'role': user.role}, status=200)
    except CustomUser.DoesNotExist:  # Correctly indented
        return Response({'error': 'User  not found'}, status=404)
