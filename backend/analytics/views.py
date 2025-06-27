from datetime import timedelta
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from django.db.models import Count, F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError

User = get_user_model()

class UserCountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        now_time = now()
        query_type = request.query_params.get('type', 'all')

        if query_type == 'week':
            # Start of the week (Monday 00:00)
            start_of_week = now_time - timedelta(days=now_time.weekday())
            start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

            # Count users joined this week
            weekly_users = User.objects.filter(
                date_joined__gte=start_of_week,
                is_superuser=False,
                is_staff=False
            ).count()

            # Total users to calculate growth percentage (avoid division by zero)
            total_users = User.objects.exclude(is_superuser=True, is_staff=True).count()
            percentage = (weekly_users / total_users * 100) if total_users > 0 else 0

            return Response({
                "user_count": weekly_users,
                "percentage": round(percentage, 2)
            }, status=200)

        else:  # all-time
            # Total users (all time)
            total_users = User.objects.exclude(is_superuser=True, is_staff=True).count()

            # Define baseline date for growth calculation (e.g., 30 days ago)
            baseline_date = now_time - timedelta(days=30)

            baseline_users = User.objects.filter(
                date_joined__lt=baseline_date,
                is_superuser=False,
                is_staff=False
            ).count()

            new_users_since_baseline = total_users - baseline_users

            if baseline_users > 0:
                percentage = (new_users_since_baseline / baseline_users) * 100
            else:
                percentage = 100.0 if new_users_since_baseline > 0 else 0.0

            return Response({
                "user_count": total_users,
                "percentage": round(percentage, 2)
            }, status=200)
    


class TopLocationByUserCountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        level = request.query_params.get('level', 'country').lower()  # default to 'country'
        
        if level == 'country':
            queryset = User.objects.values('country') \
                .annotate(
                    user_count=Count('id'),
                    name=F('country__name')
                ).order_by('-user_count')[:10]

        elif level == 'state':
            queryset = User.objects.values('state') \
                .annotate(
                    user_count=Count('id'),
                    name=F('state__name')
                ).order_by('-user_count')[:10]

        elif level == 'city':
            queryset = User.objects.values('city') \
                .annotate(
                    user_count=Count('id'),
                    name=F('city__name')
                ).order_by('-user_count')[:10]

        else:
            return Response(
                {"error": "Invalid level parameter. Must be 'country', 'state' or 'city'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Format the response data
        data = {
            'level': level,
            'top_locations': [
                {
                    'id': item[level],   # country/state/city ID
                    'name': item['name'],  # corresponding name
                    'user_count': item['user_count']
                } for item in queryset
            ]
        }

        return Response(data, status=status.HTTP_200_OK)

class UserCountOnThisMonthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        now_time = now()
        start_of_month = now_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Users joined this month
        monthly_users = User.objects.filter(
            date_joined__gte=start_of_month,
            is_superuser=False,
            is_staff=False
        ).count()
        print(monthly_users)
        # Total users excluding superuser/staff
        total_users = User.objects.exclude(is_superuser=True, is_staff=True).count()

        percentage = (monthly_users / total_users * 100) if total_users > 0 else 0

        # Optional: limit percentage to 100%
        if percentage > 100:
            percentage = 100

        return Response({
            "user_count": monthly_users,
            "percentage": round(percentage, 2)
        }, status=status.HTTP_200_OK)



class TopOneCountryByUserCountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query_type = request.query_params.get('type', 'all')  # 'all' or 'week'
        now_time = now()

        if query_type == 'week':
            start_of_week = now_time - timedelta(days=now_time.weekday())
            start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

            filtered_users = User.objects.filter(date_joined__gte=start_of_week).exclude(country__isnull=True)
        else:
            filtered_users = User.objects.exclude(country__isnull=True)

        total_users = filtered_users.count()

        top_country = filtered_users.values('country') \
            .annotate(user_count=Count('id'), name=F('country__name')) \
            .order_by('-user_count') \
            .first()

        if not top_country or total_users == 0:
            return Response({"error": "No users found for this criteria."}, status=status.HTTP_404_NOT_FOUND)

        percentage = (top_country['user_count'] / total_users) * 100

        data = {
            "country_id": top_country['country'],
            "country_name": top_country['name'],
            "user_count": top_country['user_count'],
            "percentage": round(percentage, 2),
        }

        return Response(data, status=status.HTTP_200_OK)


class SignUpUserTodayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today = now().date()
        user_count_today = User.objects.filter(date_joined__date=today).exclude(is_superuser=True, is_staff=True).count()

        # Optional: Get the total user count for percentage calculation
        total_users = User.objects.exclude(is_superuser=True, is_staff=True).count()
        percentage = (user_count_today / total_users * 100) if total_users > 0 else 0
        # Optional: Limit percentage to 100%
        return Response({
            "user_count_today": user_count_today,
            "percentage": round(percentage, 2)
        }, status=status.HTTP_200_OK)

# class LoggedUsersCountView(APIView):
#     authentication_classes = []
#     permission_classes = [AllowAny]

#     def get(self, request):
#         now = dj_timezone.now()
#         blacklisted_token_ids = set(BlacklistedToken.objects.values_list('token_id', flat=True))

#         valid_user_ids = set()
#         expired_user_ids = set()
#         blacklisted_user_ids = set()
#         all_token_user_ids = set()

#         for token_obj in OutstandingToken.objects.all():
#             user_id = token_obj.user_id
#             all_token_user_ids.add(user_id)

#             if token_obj.id in blacklisted_token_ids:
#                 blacklisted_user_ids.add(user_id)
#                 continue

#             try:
#                 payload = jwt.decode(
#                     token_obj.token,
#                     settings.SECRET_KEY,
#                     algorithms=["HS256"]
#                 )
#                 exp_timestamp = payload.get("exp")
#                 if exp_timestamp:
#                     exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
#                     if exp_datetime > now:
#                         valid_user_ids.add(user_id)
#                     else:
#                         expired_user_ids.add(user_id)
#                 else:
#                     expired_user_ids.add(user_id)
#             except ExpiredSignatureError:
#                 expired_user_ids.add(user_id)
#             except DecodeError:
#                 continue  # Skip completely invalid tokens

#         # Exclude superusers and staff from all user sets
#         excluded_ids = set(User.objects.filter(is_superuser=True).values_list('id', flat=True)) | \
#                        set(User.objects.filter(is_staff=True).values_list('id', flat=True))

#         valid_user_ids -= excluded_ids
#         expired_user_ids -= excluded_ids
#         blacklisted_user_ids -= excluded_ids
#         all_token_user_ids -= excluded_ids

#         return Response({
#             'logged_in_user_count': len(valid_user_ids),
#             'expired_token_user_count': len(expired_user_ids),
#             'blacklisted_user_count': len(blacklisted_user_ids),
#             'total_token_user_count': len(all_token_user_ids)
#         }, status=status.HTTP_200_OK)


