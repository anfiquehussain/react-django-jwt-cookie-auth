from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from  .views import *
from django.urls import path

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomCookieTokenRefreshView.as_view(), name='token_refresh'),
    path('user/', GetUser.as_view(), name='get_user'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('is_authenticated/', IsAuthenticatedView.as_view(), name='is_authenticated'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('csrf/', CSRFTokenView.as_view(), name='get-csrf-token'),
    path('countries/', CountryListView.as_view(), name='country-list'),
    path('countries/<int:country_id>/states/', StateListView.as_view(), name='state-list'),
    path('states/<int:state_id>/cities/', CityListView.as_view(), name='city-list'),

]
