from . import showing
from django.urls import path
from .showing.auth_views import register_user, login_user
from .views import home_view

urlpatterns = [
    path('', home_view, name='home'),
    path('api/register/', register_user, name='api_register'),
    path('api/login/', login_user, name='api_login'),

]
