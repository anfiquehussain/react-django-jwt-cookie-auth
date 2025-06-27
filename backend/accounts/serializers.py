# serializers.py
from rest_framework import serializers
from .models import *

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password1'}
    )

    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password2'}
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'country', 'state', 'city']
        required_fields = ['username', 'email', 'password1', 'password2', 'country']

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email is already in use."})

        if '@' in attrs['username']:
            raise serializers.ValidationError({"username": "@ is not allowed in username."})

        country = attrs.get('country')
        state = attrs.get('state')
        city = attrs.get('city')

        # Extract IDs from model instances
        country_id = country.id if country else None
        state_id = state.id if state else None
        city_id = city.id if city else None

        # Existence checks
        if country_id and not Country.objects.filter(id=country_id).exists():
            raise serializers.ValidationError({"country": "Country does not exist."})

        if state_id and not State.objects.filter(id=state_id).exists():
            raise serializers.ValidationError({"state": "State does not exist."})

        if city_id and not City.objects.filter(id=city_id).exists():
            raise serializers.ValidationError({"city": "City does not exist."})

        # Relationship validation
        if country_id and state_id:
            if not State.objects.filter(id=state_id, country_id=country_id).exists():
                raise serializers.ValidationError({"state": "State does not belong to the selected country."})

        if state_id and city_id:
            if not City.objects.filter(id=city_id, state_id=state_id).exists():
                raise serializers.ValidationError({"city": "City does not belong to the selected state."})

        return attrs




    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password1'],
            country=validated_data.get('country'),
            state=validated_data.get('state'),
            city=validated_data.get('city'),
        )
        return user


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = "__all__"

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    country = serializers.CharField(source='country.name')
    state = serializers.CharField(source='state.name')
    city = serializers.CharField(source='city.name')
    class Meta:
        model = User
        fields = ['username', 'email', 'country', 'state', 'city', 'date_joined', 'last_login']
    

class UserListSerializer(serializers.ModelSerializer):
    country = serializers.CharField(source='country.name')
    state = serializers.CharField(source='state.name')
    city = serializers.CharField(source='city.name')
    class Meta:
        model = User
        fields = ['username', 'country', 'state', 'city','date_joined']