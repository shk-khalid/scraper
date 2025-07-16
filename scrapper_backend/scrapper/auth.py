from rest_framework import authentication, exceptions
from .supabase_client import supabase

class SupabaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(" ")[1]
        user = supabase.auth.get_user(token)
        
        if user.error or not user.data.user:
            raise exceptions.AuthenticationFailed("Invalid or expired token")

        return (user.data.user, None)