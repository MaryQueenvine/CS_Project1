import os

from django.http import HttpResponse
from django.conf import settings
from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from openai import OpenAI, models
from .models import CustomUser, ChatSession, ChatMessage, Therapist, TherapistAssignment, Resource
from .serializer import (UserSerializer, MoodEntrySerializer,
                         MoodPatternSerializer,
                         MoodStatsSerializer,
                         MoodInsightsSerializer, ResourceSerializer)
import logging
from django.utils import timezone
from datetime import date, timedelta
from django.db.models import Count, Avg
from .models import MoodEntry, MoodPattern



logger = logging.getLogger(__name__)


def home_view(request):
    return HttpResponse("<h1>Welcome to StudentMindCare Backend</h1>")


@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully!'}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_user_role(request, uid):
    try:
        user = CustomUser.objects.get(uid=uid)
        return Response({'role': user.role}, status=200)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# LLM chatbot integration
#client = OpenAI(api_key=settings.OPENAI_API_KEY)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

client = None
if OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)
else:
    print("⚠️  WARNING: OPENAI_API_KEY not set. Chatbot will not work.")

RISK_KEYWORDS = [
    "i want to end it", "i don't want to live", "i'm thinking of hurting myself",
    "i want to die", "i hate my life", "there's no way out", "i want to disappear",
    "suicide", "kill myself", "self harm", "hurt myself", "end my life"
]

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
import json
import openai  # or your preferred LLM library


class ChatbotAPI(View):
    @method_decorator(login_required)
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            session_type = data.get('session_type', 'support')

            # Get or create chat session
            session, created = ChatSession.objects.get_or_create(
                user=request.user,
                session_type=session_type,
                is_complete=False
            )

            # Generate response based on session type
            if session_type == 'triage':
                response_data = self.handle_triage(user_message, session)
            else:
                response_data = self.handle_support_chat(user_message, session)

            # Save the conversation
            ChatMessage.objects.create(
                session=session,
                message=user_message,
                response=response_data['reply'],
                is_flagged=response_data.get('flagged', False),
                flag_reason=response_data.get('flag_reason', '')
            )

            return JsonResponse(response_data)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def handle_triage(self, message, session):
        # Triage-specific prompting
        system_prompt = """
        You are a mental health triage assistant. Your role is to:
        1. Assess the patient's current mental state
        2. Identify severity level (low, medium, high risk)
        3. Determine appropriate therapist specialization needed
        4. Ask relevant follow-up questions for assessment

        Keep responses empathetic but professional. Flag any mentions of:
        - Suicide ideation
        - Self-harm
        - Substance abuse
        - Psychosis symptoms
        """

        response = self.get_llm_response(message, system_prompt)

        # Check for completion criteria (you can customize this logic)
        triage_complete = self.check_triage_completion(session)

        if triage_complete:
            therapist = self.assign_therapist(session)
            response += f"\n\nBased on our conversation, I've matched you with {therapist.name}, who specializes in areas that align with your needs."
            session.is_complete = True
            session.save()

        return {
            'reply': response,
            'flagged': self.check_crisis_flags(message),
            'triage_complete': triage_complete
        }

    def handle_support_chat(self, message, session):
        system_prompt = """
        You are a supportive mental health chatbot. Provide:
        1. Empathetic responses
        2. Coping strategies
        3. Validation of feelings
        4. Gentle guidance toward professional help when appropriate

        Always maintain boundaries - you're supportive but not a replacement for therapy.
        """

        response = self.get_llm_response(message, system_prompt)

        return {
            'reply': response,
            'flagged': self.check_crisis_flags(message)
        }

    def get_llm_response(self, message, system_prompt):
        # Replace with your LLM integration
        try:
            # Example with OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ]
            )
            return response.choices[0].message.content
        except:
            return "I'm having trouble processing your message right now. Please try again."

    def check_crisis_flags(self, message):
        # Implement crisis detection logic
        crisis_keywords = [
            'suicide', 'kill myself', 'end it all', 'not worth living',
            'hurt myself', 'self harm', 'overdose'
        ]

        message_lower = message.lower()
        return any(keyword in message_lower for keyword in crisis_keywords)

    def check_triage_completion(self, session):
        # Define logic for when triage is complete
        # E.g., minimum number of messages, key questions answered
        message_count = session.chatmessage_set.count()
        return message_count >= 5  # Simplified logic

    def assign_therapist(self, session):
        # Implement therapist assignment logic
        # This could be based on triage responses, availability, specialties
        available_therapists = Therapist.objects.filter(
            current_patients__lt=models.F('max_patients')
        )

        # Simple assignment - you'd want more sophisticated matching
        therapist = available_therapists.first()

        if therapist:
            TherapistAssignment.objects.create(
                user=session.user,
                therapist=therapist,
                triage_score={}  # Store assessment results
            )
            therapist.current_patients += 1
            therapist.save()

        return therapist
        return Response({"error": "Chatbot service unavailable"}, status=500)

#moodcheckin
@api_view(['POST'])
def mood_checkin(request):
    """Handle mood check-in submissions"""
    serializer = MoodEntrySerializer(data=request.data)

    if serializer.is_valid():
        mood_entry = serializer.save()

        # Generate daily pattern for today
        MoodPattern.generate_daily_pattern(mood_entry.date)

        return Response({
            'message': 'Mood check-in submitted successfully',
            'mood_entry': serializer.data,
            'streak': MoodEntry.get_mood_streak()
        }, status=status.HTTP_201_CREATED)

    return Response({
        'message': 'Invalid data',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def today_moods(request):
    """Get today's mood entries"""
    today_entries = MoodEntry.get_today_entries()
    serializer = MoodEntrySerializer(today_entries, many=True)

    return Response({
        'date': date.today(),
        'count': today_entries.count(),
        'moods': serializer.data
    })


@api_view(['GET'])
def mood_streak(request):
    """Get current mood tracking streak"""
    streak = MoodEntry.get_mood_streak()

    return Response({
        'streak': streak,
        'message': f"You've been tracking your mood for {streak} consecutive days!"
    })


@api_view(['GET'])
def mood_stats(request):
    """Get mood statistics for specified period"""
    days = int(request.GET.get('days', 30))
    stats = MoodEntry.get_mood_stats(days)
    stats['streak'] = MoodEntry.get_mood_streak()

    serializer = MoodStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
def mood_history(request):
    """Get paginated mood history"""
    days = int(request.GET.get('days', 30))
    start_date = date.today() - timedelta(days=days)

    entries = MoodEntry.objects.filter(timestamp__date__gte=start_date)
    serializer = MoodEntrySerializer(entries, many=True)

    return Response({
        'period': f"Last {days} days",
        'total_entries': entries.count(),
        'entries': serializer.data
    })


@api_view(['GET'])
def mood_patterns(request):
    """Get mood patterns for analysis"""
    days = int(request.GET.get('days', 30))
    start_date = date.today() - timedelta(days=days)

    patterns = MoodPattern.objects.filter(date__gte=start_date)
    serializer = MoodPatternSerializer(patterns, many=True)

    return Response({
        'period': f"Last {days} days",
        'patterns': serializer.data
    })


@api_view(['GET'])
def mood_insights(request):
    """Get mood insights and recommendations"""
    days = int(request.GET.get('days', 30))
    start_date = date.today() - timedelta(days=days)

    entries = MoodEntry.objects.filter(timestamp__date__gte=start_date)
    patterns = MoodPattern.objects.filter(date__gte=start_date)

    if not entries.exists():
        return Response({
            'message': 'No mood data available for insights',
            'insights': None
        })

    # Calculate insights
    mood_counts = {}
    for choice in MoodEntry.MOOD_CHOICES:
        mood_counts[choice[0]] = entries.filter(mood=choice[0]).count()

    most_common_mood = max(mood_counts, key=mood_counts.get) if mood_counts else None

    # Get best and challenging days
    best_pattern = patterns.order_by('-mood_score').first()
    challenging_pattern = patterns.order_by('mood_score').first()

    # Calculate averages
    weekly_avg = patterns.filter(date__gte=date.today() - timedelta(days=7)).aggregate(
        avg=Avg('mood_score')
    )['avg'] or 0

    monthly_avg = patterns.aggregate(avg=Avg('mood_score'))['avg'] or 0

    # Generate recommendations
    recommendations = generate_mood_recommendations(most_common_mood, mood_counts, weekly_avg)

    # Determine trend
    recent_patterns = patterns.order_by('-date')[:7]
    older_patterns = patterns.order_by('-date')[7:14]

    trend = 'stable'
    if recent_patterns.exists() and older_patterns.exists():
        recent_avg = sum(p.mood_score for p in recent_patterns) / len(recent_patterns)
        older_avg = sum(p.mood_score for p in older_patterns) / len(older_patterns)

        if recent_avg > older_avg + 0.5:
            trend = 'improving'
        elif recent_avg < older_avg - 0.5:
            trend = 'declining'

    insights = {
        'most_common_mood': most_common_mood,
        'mood_trend': trend,
        'best_day': best_pattern.date if best_pattern else None,
        'challenging_day': challenging_pattern.date if challenging_pattern else None,
        'weekly_average': round(weekly_avg, 2),
        'monthly_average': round(monthly_avg, 2),
        'recommendations': recommendations
    }

    serializer = MoodInsightsSerializer(insights)
    return Response(serializer.data)


def generate_mood_recommendations(most_common_mood, mood_counts, weekly_avg):
    """Generate personalized mood recommendations"""
    recommendations = []

    # Analyze mood patterns
    negative_moods = ['very_sad', 'sad', 'angry', 'anxious', 'stressed']
    negative_count = sum(mood_counts.get(mood, 0) for mood in negative_moods)
    total_entries = sum(mood_counts.values())

    if total_entries == 0:
        return ["Start tracking your mood daily to get personalized insights!"]

    negative_percentage = (negative_count / total_entries) * 100

    # General recommendations based on patterns
    if negative_percentage > 50:
        recommendations.extend([
            "Consider speaking with a mental health professional for additional support",
            "Practice mindfulness meditation for 10-15 minutes daily",
            "Engage in regular physical activity to boost mood",
            "Maintain a consistent sleep schedule"
        ])

    if mood_counts.get('stressed', 0) > 3:
        recommendations.append("Try stress management techniques like deep breathing or progressive muscle relaxation")

    if mood_counts.get('tired', 0) > 5:
        recommendations.append("Evaluate your sleep quality and consider a consistent bedtime routine")

    if mood_counts.get('anxious', 0) > 3:
        recommendations.append("Practice grounding techniques like the 5-4-3-2-1 method when feeling anxious")

    if weekly_avg < 5:
        recommendations.append("Focus on activities that bring you joy and connection with others")

    # Positive reinforcement
    if most_common_mood in ['happy', 'very_happy', 'excited']:
        recommendations.append("Great job maintaining positive mood patterns! Keep up the good work!")

    # Default recommendations if none triggered
    if not recommendations:
        recommendations.extend([
            "Continue tracking your mood to identify patterns",
            "Maintain healthy habits like regular exercise and good sleep",
            "Practice gratitude by noting three things you're thankful for each day",
            "Connect with friends and family regularly",
            "Spend time in nature or outdoors when possible"
        ])

    # Limit recommendations to avoid overwhelming the user
    return recommendations[:5]


# Additional API endpoints for comprehensive mood tracking

@api_view(['GET'])
def mood_calendar(request):
    """Get mood data formatted for calendar view"""
    year = int(request.GET.get('year', date.today().year))
    month = int(request.GET.get('month', date.today().month))

    # Get all mood entries for the specified month
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    entries = MoodEntry.objects.filter(
        timestamp__date__gte=start_date,
        timestamp__date__lt=end_date
    ).order_by('timestamp')

    # Group entries by date
    calendar_data = {}
    for entry in entries:
        date_str = entry.timestamp.date().isoformat()
        if date_str not in calendar_data:
            calendar_data[date_str] = []

        calendar_data[date_str].append({
            'mood': entry.mood,
            'mood_display': entry.get_mood_display(),
            'note': entry.note,
            'time': entry.timestamp.strftime('%H:%M')
        })

    return Response({
        'year': year,
        'month': month,
        'calendar_data': calendar_data,
        'total_days_tracked': len(calendar_data)
    })


@api_view(['DELETE'])
def delete_mood_entry(request, entry_id):
    """Delete a specific mood entry"""
    try:
        entry = MoodEntry.objects.get(id=entry_id)
        entry_date = entry.date
        entry.delete()

        # Regenerate daily pattern for that date
        MoodPattern.generate_daily_pattern(entry_date)

        return Response({
            'message': 'Mood entry deleted successfully'
        }, status=status.HTTP_200_OK)

    except MoodEntry.DoesNotExist:
        return Response({
            'message': 'Mood entry not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_mood_entry(request, entry_id):
    """Update a specific mood entry"""
    try:
        entry = MoodEntry.objects.get(id=entry_id)
        serializer = MoodEntrySerializer(entry, data=request.data, partial=True)

        if serializer.is_valid():
            entry_date = entry.date
            serializer.save()

            # Regenerate daily pattern for that date
            MoodPattern.generate_daily_pattern(entry_date)

            return Response({
                'message': 'Mood entry updated successfully',
                'mood_entry': serializer.data
            })

        return Response({
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except MoodEntry.DoesNotExist:
        return Response({
            'message': 'Mood entry not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def mood_export(request):
    """Export mood data as CSV"""
    from django.http import HttpResponse
    import csv

    days = int(request.GET.get('days', 365))  # Default to 1 year
    start_date = date.today() - timedelta(days=days)

    entries = MoodEntry.objects.filter(timestamp__date__gte=start_date).order_by('timestamp')

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="mood_data_{date.today().isoformat()}.csv"'

    writer = csv.writer(response)
    writer.writerow(['Date', 'Time', 'Mood', 'Mood Display', 'Note'])

    for entry in entries:
        writer.writerow([
            entry.timestamp.date().isoformat(),
            entry.timestamp.time().strftime('%H:%M:%S'),
            entry.mood,
            entry.get_mood_display(),
            entry.note or ''
        ])

    return response


class MoodEntryListView(generics.ListAPIView):
    """List view for mood entries with filtering and pagination"""
    serializer_class = MoodEntrySerializer

    def get_queryset(self):
        queryset = MoodEntry.objects.all()

        # Filter by mood
        mood = self.request.query_params.get('mood', None)
        if mood:
            queryset = queryset.filter(mood=mood)

        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if start_date:
            queryset = queryset.filter(timestamp__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__date__lte=end_date)

        # Filter by has_note
        has_note = self.request.query_params.get('has_note', None)
        if has_note == 'true':
            queryset = queryset.exclude(note__isnull=True).exclude(note__exact='')
        elif has_note == 'false':
            queryset = queryset.filter(note__isnull=True) | queryset.filter(note__exact='')

        return queryset.order_by('-timestamp')


@api_view(['GET'])
def mood_summary(request):
    """Get a comprehensive mood summary"""
    days = int(request.GET.get('days', 30))
    start_date = date.today() - timedelta(days=days)

    entries = MoodEntry.objects.filter(timestamp__date__gte=start_date)
    patterns = MoodPattern.objects.filter(date__gte=start_date)

    # Basic stats
    total_entries = entries.count()
    total_days = (date.today() - start_date).days + 1
    days_tracked = entries.values('timestamp__date').distinct().count()

    # Mood distribution
    mood_counts = {}
    for choice in MoodEntry.MOOD_CHOICES:
        mood_counts[choice[0]] = entries.filter(mood=choice[0]).count()

    # Time-based analysis
    hourly_distribution = {}
    for entry in entries:
        hour = entry.timestamp.hour
        hourly_distribution[hour] = hourly_distribution.get(hour, 0) + 1

    # Best and worst streaks
    streak = MoodEntry.get_mood_streak()

    return Response({
        'period': {
            'days': days,
            'start_date': start_date,
            'end_date': date.today()
        },
        'tracking_stats': {
            'total_entries': total_entries,
            'total_days': total_days,
            'days_tracked': days_tracked,
            'tracking_percentage': round((days_tracked / total_days) * 100, 1),
            'current_streak': streak
        },
        'mood_distribution': mood_counts,
        'hourly_distribution': hourly_distribution,
        'patterns_count': patterns.count(),
        'has_insights': total_entries >= 7  # Need at least a week of data for insights
    })

#Therapists resources
class ResourceListCreate(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]


class ResourceDelete(generics.DestroyAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]