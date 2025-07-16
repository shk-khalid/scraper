from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .supabase_client import supabase
from .auth import SupabaseAuthentication
import requests
from bs4 import BeautifulSoup

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get("email")
    password = request.data.get("password")
    result = supabase.auth.sign_up({"email": email, "password": password})
    if result.error:
        return Response({"error": str(result.error)}, status=400)
    return Response({"message": "User registered. Confirm email to proceed."})

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    result = supabase.auth.sign_in_with_password({"email": email, "password": password})
    if result.error:
        return Response({"error": str(result.error)}, status=401)
    return Response(result.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email")
    result = supabase.auth.reset_password_email(email)
    if result.error:
        return Response({"error": str(result.error)}, status=400)
    return Response({"message": "Reset email sent."})

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    provider_token = request.data.get("provider_token")
    result = supabase.auth.sign_in_with_id_token({
        "provider": "google",
        "token": provider_token
    })
    if result.error:
        return Response({"error": str(result.error)}, status=401)
    return Response(result.data)

@api_view(['GET'])
@authentication_classes([SupabaseAuthentication])
@permission_classes([IsAuthenticated])
def scrape(request):
    try:
        url = "https://example.com"
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(response.text, "html.parser")
        items = [item.get_text(strip=True) for item in soup.select(".headline")]
        return Response({"email": request.user.email, "data": items})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
