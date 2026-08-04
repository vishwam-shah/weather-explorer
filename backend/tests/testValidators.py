from datetime import date, timedelta

import pytest
from pydantic import ValidationError

from app.validators.weatherValidator import WeatherRequest


class TestWeatherRequestValidation:
    def test_valid_request(self):
        req = WeatherRequest(
            latitude=52.52,
            longitude=13.41,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 15),
        )
        assert req.latitude == 52.52
        assert req.longitude == 13.41

    def test_latitude_out_of_range(self):
        with pytest.raises(ValidationError, match="Latitude must be between"):
            WeatherRequest(
                latitude=91.0,
                longitude=13.41,
                start_date=date(2024, 1, 1),
                end_date=date(2024, 1, 15),
            )

    def test_latitude_negative_boundary(self):
        req = WeatherRequest(
            latitude=-90.0,
            longitude=0.0,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 5),
        )
        assert req.latitude == -90.0

    def test_longitude_out_of_range(self):
        with pytest.raises(ValidationError, match="Longitude must be between"):
            WeatherRequest(
                latitude=52.52,
                longitude=181.0,
                start_date=date(2024, 1, 1),
                end_date=date(2024, 1, 15),
            )

    def test_start_date_after_end_date(self):
        with pytest.raises(ValidationError, match="start_date must be on or before"):
            WeatherRequest(
                latitude=52.52,
                longitude=13.41,
                start_date=date(2024, 1, 20),
                end_date=date(2024, 1, 1),
            )

    def test_date_range_exceeds_31_days(self):
        with pytest.raises(ValidationError, match="must not exceed 31 days"):
            WeatherRequest(
                latitude=52.52,
                longitude=13.41,
                start_date=date(2024, 1, 1),
                end_date=date(2024, 3, 1),
            )

    def test_same_start_and_end_date(self):
        req = WeatherRequest(
            latitude=0.0,
            longitude=0.0,
            start_date=date(2024, 6, 15),
            end_date=date(2024, 6, 15),
        )
        assert req.start_date == req.end_date

    def test_end_date_in_future(self):
        future = date.today() + timedelta(days=5)
        with pytest.raises(ValidationError, match="historical date"):
            WeatherRequest(
                latitude=52.52,
                longitude=13.41,
                start_date=date(2024, 1, 1),
                end_date=future,
            )
