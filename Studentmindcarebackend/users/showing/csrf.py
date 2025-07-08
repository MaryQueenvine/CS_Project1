from django.http import HttpResponseForbidden

def csrf_failure(request, reason=""):
    return HttpResponseForbidden(f"CSRF verification failed. Reason: {reason}")
