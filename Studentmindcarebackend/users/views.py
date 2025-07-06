from django.http import HttpResponse
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from openai import OpenAI
from .models import CustomUser
from .serializer import UserSerializer
import logging

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
client = OpenAI(api_key=settings.OPENAI_API_KEY)

RISK_KEYWORDS = [
    "i want to end it", "i don't want to live", "i'm thinking of hurting myself",
    "i want to die", "i hate my life", "there's no way out", "i want to disappear",
    "suicide", "kill myself", "self harm", "hurt myself", "end my life"
]


class ChatBotAPIView(APIView):
    def post(self, request):
        try:
            # Get user message
            user_message = request.data.get("message", "")

            # Validate input
            if not user_message.strip():
                return Response(
                    {"error": "Message cannot be empty"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            logger.info(f"Received message: {user_message}")

            # Check for risk keywords
            flagged = any(phrase in user_message.lower() for phrase in RISK_KEYWORDS)

            # Prepare system prompt for mental health context
            system_prompt = """You are a supportive mental health assistant for students. 
            Provide empathetic, helpful responses while being mindful of mental health concerns. 
            If someone expresses suicidal thoughts or self-harm, encourage them to seek professional help 
            and provide crisis resources. Keep responses concise but caring."""

            # Call OpenAI API with new syntax
            try:
                completion = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    temperature=0.7,
                    max_tokens=500  # Limit response length
                )

                response_text = completion.choices[0].message.content

            except Exception as openai_error:
                logger.error(f"OpenAI API error: {str(openai_error)}")

                # Provide more specific error messages
                if "rate_limit" in str(openai_error).lower():
                    return Response(
                        {"error": "Rate limit exceeded. Please try again later."},
                        status=status.HTTP_429_TOO_MANY_REQUESTS
                    )
                elif "invalid_api_key" in str(openai_error).lower():
                    return Response(
                        {"error": "API key configuration error"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                else:
                    return Response(
                        {"error": "AI service temporarily unavailable"},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )

            # Handle flagged content
            if flagged:
                logger.warning("⚠️ Suicide-related message flagged.")
                # Add crisis resources to flagged responses
                crisis_message = "\n\n🚨 If you're having thoughts of self-harm, please reach out for help:\n" \
                                 "• National Suicide Prevention Lifeline: 988\n" \
                                 "• Crisis Text Line: Text HOME to 741741\n" \
                                 "• Emergency Services: 911"
                response_text += crisis_message

                # TODO: Save flag to DB or alert therapist
                # You might want to save this to your database
                # self.save_flagged_message(user_message, response_text)

            return Response({
                "reply": response_text,
                "flagged": flagged,
                "timestamp": request.META.get('HTTP_X_FORWARDED_FOR',
                                              request.META.get('REMOTE_ADDR'))
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Unexpected error in ChatBotAPIView: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Optional: Add a method to save flagged messages
    def save_flagged_message(self, user_message, bot_response):
        """Save flagged messages to database for review"""
        try:
            # Implement your database saving logic here
            # Example:
            # FlaggedMessage.objects.create(
            #     message=user_message,
            #     response=bot_response,
            #     timestamp=timezone.now()
            # )
            pass
        except Exception as e:
            logger.error(f"Error saving flagged message: {str(e)}")


# Alternative function-based view if you prefer
@api_view(['POST'])
def chatbot_view(request):
    """Alternative function-based chatbot view"""
    user_message = request.data.get("message", "")

    if not user_message.strip():
        return Response({"error": "Message cannot be empty"}, status=400)

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_message}],
            temperature=0.7
        )

        response_text = completion.choices[0].message.content

        return Response({"reply": response_text}, status=200)

    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}")
        return Response({"error": "Chatbot service unavailable"}, status=500)