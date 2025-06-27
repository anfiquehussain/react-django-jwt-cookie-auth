from rest_framework_simplejwt import authentication as jwt_authentication
from django.conf import settings
from rest_framework import authentication, exceptions as rest_exceptions

def enforce_csrf(request):
    check = authentication.CSRFCheck(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise rest_exceptions.PermissionDenied('CSRF Failed: %s' % reason)

class CookieJWTAuthentication(jwt_authentication.JWTAuthentication):
    def authenticate(self, request):
        # First check header as normal
        header = self.get_header(request)
        if header:
            raw_token = self.get_raw_token(header)
        else:
            # If no header, check for the cookie using the name from settings
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
        
        if raw_token is None:
            return None
            
        validated_token = self.get_validated_token(raw_token)
        
        # Only enforce CSRF on authenticated requests with cookies
        if raw_token and not header:
            enforce_csrf(request)
            
        return self.get_user(validated_token), validated_token