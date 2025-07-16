from django.urls import path
from .views import register, login, forgot_password, google_auth, scrape

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('forgot/', forgot_password),
    path('google/', google_auth),
    path('scrape/', scrape),
]
