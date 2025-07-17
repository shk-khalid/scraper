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
    if not email or not password:
        return Response(
            {"message": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        supabase.auth.sign_up({"email": email, "password": password})
        return Response(
            {"message": "Registration successful. Please verify via email if required."},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {"message": f"Registration failed: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if not email or not password:
        return Response(
            {"message": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        resp = supabase.auth.sign_in_with_password({"email": email, "password": password})

        session = getattr(resp, 'session', None) or getattr(getattr(resp, 'data', {}), 'session', None)
        user = getattr(resp, 'user', None) or getattr(getattr(resp, 'data', {}), 'user', None)

        if session and session.access_token:
            django_resp = Response(
                {"message": "Login successful.", "user_email": user.email},
                status=status.HTTP_200_OK
            )
            # set tokens in HttpOnly cookies
            django_resp.set_cookie(
                "access_token",
                session.access_token,
                httponly=True,
                samesite="Lax"
            )
            django_resp.set_cookie(
                "refresh_token",
                session.refresh_token,
                httponly=True,
                samesite="Lax"
            )
            return django_resp

        return Response(
            {"message": "Invalid credentials."},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        return Response(
            {"message": f"Login failed: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email")
    if not email:
        return Response(
            {"message": "Email is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        supabase.auth.reset_password_for_email(email)
        return Response({"message": "Password reset email sent."})
    except Exception as e:
        return Response(
            {"message": f"Failed to send reset email: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    provider_token = request.data.get("provider_token")
    if not provider_token:
        return Response(
            {"message": "Google provider_token is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        resp = supabase.auth.sign_in_with_id_token({
            "provider": "google",
            "id_token": provider_token
        })

        session = getattr(resp, 'session', None) or getattr(getattr(resp, 'data', {}), 'session', None)
        user = getattr(resp, 'user', None) or getattr(getattr(resp, 'data', {}), 'user', None)

        if session and session.access_token:
            django_resp = Response(
                {"message": "Google authentication successful.", "user_email": user.email},
                status=status.HTTP_200_OK
            )
            django_resp.set_cookie("access_token", session.access_token, httponly=True, samesite="Lax")
            django_resp.set_cookie("refresh_token", session.refresh_token, httponly=True, samesite="Lax")
            return django_resp

        return Response(
            {"message": "Google authentication failed."},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        return Response(
            {"message": f"Google auth error: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@authentication_classes([SupabaseAuthentication])
@permission_classes([AllowAny])
def scrape(request):
    url = request.data.get("url")
    selector = request.data.get("selector")

    if not url or not selector:
        return Response(
            {"message": "Both 'url' and 'selector' are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        elements = soup.select(selector)
        if not elements:
            return Response(
                {"message": f"No elements found for selector: {selector}"},
                status=status.HTTP_404_NOT_FOUND
            )

        data = [el.get_text(strip=True) for el in elements]
        return Response({
            "message": "Scrape successful.",
            "data": data
        })
    except requests.exceptions.RequestException as e:
        return Response(
            {"message": f"Request failed: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"message": f"Scraping failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
