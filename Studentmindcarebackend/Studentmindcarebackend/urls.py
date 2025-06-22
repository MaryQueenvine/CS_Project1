"""
URL configuration for Studentmindcarebackend project.

The `urlpatterns` list routes URLs to showing. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function showing
    1. Add an import:  from my_app import showing
    2. Add a URL to urlpatterns:  path('', showing.home, name='home')
Class-based showing
    1. Add an import:  from other_app.showing import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, include


urlpatterns = [
    path('', lambda request: redirect('/admin/')),  # Redirect root to /admin/
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
]


