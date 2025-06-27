import os
import json
from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import Country, State, City

class Command(BaseCommand):
    help = 'Create or update countries, states, and cities from JSON (simplified version)'

    def handle(self, *args, **kwargs):
        file_path = os.path.join('accounts', 'fixtures', 'countries_states_cities.json')

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            countries = json.load(f)

        total_created_countries = 0
        total_existing_countries = 0

        for idx_country, country_data in enumerate(countries, start=1):
            with transaction.atomic():
                country_obj, created_country = Country.objects.get_or_create(
                    name=country_data.get('name')
                )

                if created_country:
                    total_created_countries += 1
                    self.stdout.write(f"[{idx_country}] Created Country: {country_obj.name}")
                else:
                    total_existing_countries += 1
                    self.stdout.write(f"[{idx_country}] Country Exists: {country_obj.name}")

                for state_data in country_data.get('states', []):
                    state_obj, _ = State.objects.get_or_create(
                        country=country_obj,
                        name=state_data.get('name')
                    )

                    for city_data in state_data.get('cities', []):
                        City.objects.get_or_create(
                            state=state_obj,
                            name=city_data.get('name')
                        )

                self.stdout.flush()

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Total Countries Created: {total_created_countries}, Existing: {total_existing_countries}"
        ))
