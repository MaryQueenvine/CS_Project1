from rest_framework import views
from . import showing
from django.urls import path
from .showing.auth_views import register_user, login_user
from . import views
from .views import home_view, get_user_role, ChatbotAPI

urlpatterns = [
    path('', home_view, name='home'),
    path('api/register_user', register_user, name='register_user'),
    path('api/get_user_role/<str:uid>', get_user_role, name='get_user_role'),
    path('api/login_user', login_user, name='login_user'),
    path('users/api/get_user_role/<str:uid>', get_user_role),
    path('api/chatbot/', views.ChatbotAPI.as_view(), name='chatbot_api'),
    path('api/resources/', views.ResourceListCreate.as_view(), name='resource-list-create'),
    path('api/resources/<int:pk>/', views.ResourceDelete.as_view(), name='resource-delete'),

    path('api/mood-checkin/', views.mood_checkin, name='mood_checkin'),
    path('api/mood-checkin/today/', views.today_moods, name='today_moods'),
    path('api/mood-checkin/streak/', views.mood_streak, name='mood_streak'),

    # Analytics and insights
    path('api/mood-checkin/stats/', views.mood_stats, name='mood_stats'),
    path('api/mood-checkin/history/', views.mood_history, name='mood_history'),
    path('api/mood-checkin/patterns/', views.mood_patterns, name='mood_patterns'),
    path('api/mood-checkin/insights/', views.mood_insights, name='mood_insights'),
    path('api/mood-checkin/summary/', views.mood_summary, name='mood_summary'),

    # Calendar and visualization
    path('api/mood-checkin/calendar/', views.mood_calendar, name='mood_calendar'),

    # CRUD operations
    path('api/mood-checkin/list/', views.MoodEntryListView.as_view(), name='mood_entry_list'),
    path('api/mood-checkin/<int:entry_id>/', views.update_mood_entry, name='update_mood_entry'),
    path('api/mood-checkin/<int:entry_id>/delete/', views.delete_mood_entry, name='delete_mood_entry'),

    # Data export
    path('api/mood-checkin/export/', views.mood_export, name='mood_export'),


]
