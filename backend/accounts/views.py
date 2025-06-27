from django.contrib.auth import authenticate, login,get_user_model
from django.conf import settings
from django.middleware import csrf

from rest_framework import status, exceptions as rest_exceptions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import *
from .models import *
from rest_framework.generics import ListAPIView
from django.db.models import QuerySet
from typing import Optional
import random

from rest_framework.exceptions import ValidationError
from django.db.models import Case, When


# Helper function to get user tokens
def get_user_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh_token": str(refresh),
        "access_token": str(refresh.access_token)
    }


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)  # Auto login

            # Generate access and refresh tokens
            tokens = get_user_tokens(user)

            # Create response and set cookies
            res = Response({
                'message': 'User registered and logged in successfully',
                'username': user.username,
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)

            res.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=tokens["access_token"],
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            res.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=tokens["refresh_token"],
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            # Set CSRF token in the response header
            res["X-CSRFToken"] = csrf.get_token(request)

            return res  # <-- Fixed incorrect indentation

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        login_input  = request.data.get('username') 
        password = request.data.get('password')

        user = None
        try:
            user = User.objects.get(username=login_input)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=login_input)
            except User.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        

        # if not username and not email:
        #     return Response({"error": "Username or email is required"}, status=status.HTTP_400_BAD_REQUEST)
        # if not password:
        #     return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)
        # if email:
        #     user = User.objects.filter(email=email).first()
        #     user = authenticate(username=user.username, password=password)
        # else:
        #     user = authenticate(username=username, password=password)
        # if not user:
        #     return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_user_tokens(user)
        
        # Create response and set cookies
        res = Response(tokens)
        res.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=tokens["access_token"],
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        res.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=tokens["refresh_token"],
            expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        # Set CSRF token in the response
        res["X-CSRFToken"] = csrf.get_token(request)
        return res




class CustomCookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

        if not refresh_token:
            return Response({'error': 'No refresh token found in cookies'}, status=status.HTTP_400_BAD_REQUEST)

        data = {'refresh': refresh_token}
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            # If token is invalid or expired, delete both cookies and return error
            error_response = Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
            error_response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            error_response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            return error_response

        access_token = serializer.validated_data['access']
        new_refresh_token = serializer.validated_data.get('refresh')

        response = Response({'access': access_token}, status=status.HTTP_200_OK)

        # Set new access token cookie
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=access_token,
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        # Optionally refresh refresh-token
        if new_refresh_token:
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=new_refresh_token,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

        response["X-CSRFToken"] = csrf.get_token(request)
        return response


class GetUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

# class IsAuthenticatedView(APIView):
#     permission_classes = [AllowAny]
#     def get(self, request):
#         if not request.user.is_authenticated:
#             return Response({"message": "Not authenticated", "authenticated": False}, status=status.HTTP_200_OK)
#         return Response({"message": "Authenticated", "authenticated": True}, status=status.HTTP_200_OK)

class IsAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]  
    def get(self, request):
        # if not request.user.is_authenticated:
        #     return Response({"message": "Not authenticated", "authenticated": False}, status=status.HTTP_200_OK)
        return Response({"message": "Authenticated", "authenticated": True}, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        # blacklist the refresh token and access token
        print("Attempting to blacklist tokens")
        try:
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            token = RefreshToken(refresh_token)
            token.blacklist()
            print("Token blacklisted successfully")
        except Exception as e:
            print(f"Error blacklisting token: {e}")
            pass
        # Delete cookies
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        return response
    

class CSRFTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"csrfToken": csrf.get_token(request)}, status=status.HTTP_200_OK)



class CountryListView(ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class StateListView(ListAPIView):
    serializer_class = StateSerializer

    def get_queryset(self):
        country_id = self.kwargs['country_id']
        return State.objects.filter(country_id=country_id)

class CityListView(ListAPIView):
    serializer_class = CitySerializer

    def get_queryset(self):
        state_id = self.kwargs['state_id']
        return City.objects.filter(state_id=state_id)

class UserListView(ListAPIView):
    serializer_class = UserListSerializer

    def get_queryset(self) -> QuerySet:
        queryset = User.objects.exclude(is_superuser=True)
        sort_param: Optional[str] = self.request.query_params.get('sort')
        name = self.request.query_params.get('username')

        country = self.request.query_params.get('country')
        state = self.request.query_params.get('state')
        city = self.request.query_params.get('city')

        if state and not country:
            raise ValidationError("You must provide 'country' before filtering by 'state'.")

        if city and not state:
            raise ValidationError("You must provide 'state' before filtering by 'city'.")
        
        if country and state:
            if not State.objects.filter(country__id=country, id=state).exists():
                raise ValidationError("Invalid combination of 'country' and 'state'.")
        if state and city:
            if not City.objects.filter(state__id=state, id=city).exists():
                raise ValidationError("Invalid combination of 'state' and 'city'.")

        
        if country:
            queryset = queryset.filter(country__id=country)

        if state:
            queryset = queryset.filter(state__id=state)

        if city:
            queryset = queryset.filter(city__id=city)


        if name:
            queryset = queryset.filter(username__icontains=name)

        if sort_param == 'newest':
            queryset = queryset.order_by('-date_joined')
        elif sort_param == 'oldest':
            queryset = queryset.order_by('date_joined')
        elif sort_param == 'random':
            user_ids = list(queryset.values_list('id', flat=True))
            random.shuffle(user_ids)
            preserved_order = Case(*[When(id=pk, then=pos) for pos, pk in enumerate(user_ids)])
            queryset = queryset.filter(id__in=user_ids).order_by(preserved_order)
        
        if not queryset.exists():
            raise ValidationError("No users found.")
        return queryset



