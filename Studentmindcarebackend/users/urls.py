from . import showing
from django.urls import path
from .showing.auth_views import register_user, login_user
from .views import home_view, get_user_role

urlpatterns = [
    path('', home_view, name='home'),
    path('api/register_user', register_user, name='register_user'),
    path('api/get_user_role/<str:uid>', get_user_role, name='get_user_role'),
    path('api/login_user', login_user, name='login_user'),

]
