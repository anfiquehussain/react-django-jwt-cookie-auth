from  .views import *
from django.urls import path

urlpatterns = [
    path('users/count/', UserCountView.as_view(), name='total-users'),
    path('top_locations/users/count/',TopLocationByUserCountView.as_view(), name='top-locations-by-user-count'),
    path('top_one_country/users/count/', TopOneCountryByUserCountView.as_view(), name='top-one-country-by-user-count'),
    path('users/this_month/count/', UserCountOnThisMonthView.as_view(), name='this-month-users'),
    path('users/signup/today/count/',SignUpUserTodayView.as_view(), name='signup-today'),
]
