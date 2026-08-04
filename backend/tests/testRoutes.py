import json
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient
from moto import mock_aws

from app.main import app

client = TestClient(app)

SAMPLE_WEATHER_RESPONSE = {
    "latitude": 52.52,
    "longitude": 13.41,
    "daily": {
        "time": ["2024-01-01", "2024-01-02"],
        "temperature_2m_max": [5.2, 6.1],
        "temperature_2m_min": [1.0, 2.3],
        "apparent_temperature_max": [3.1, 4.5],
        "apparent_temperature_min": [-1.2, 0.5],
    },
}


class TestStoreWeatherData:
    def test_invalid_latitude(self):
        response = client.post(
            "/store-weather-data",
            json={
                "latitude": 100,
                "longitude": 13.41,
                "start_date": "2024-01-01",
                "end_date": "2024-01-15",
            },
        )
        assert response.status_code == 422

    def test_invalid_date_range(self):
        response = client.post(
            "/store-weather-data",
            json={
                "latitude": 52.52,
                "longitude": 13.41,
                "start_date": "2024-01-01",
                "end_date": "2024-03-01",
            },
        )
        assert response.status_code == 422

    @mock_aws
    @patch("app.services.weatherService.fetch_weather_data", new_callable=AsyncMock)
    def test_successful_store(self, mock_fetch, s3_bucket):
        mock_fetch.return_value = SAMPLE_WEATHER_RESPONSE

        response = client.post(
            "/store-weather-data",
            json={
                "latitude": 52.52,
                "longitude": 13.41,
                "start_date": "2024-01-01",
                "end_date": "2024-01-15",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "file" in data
        assert data["file"].startswith("weather_52.52_13.41")


class TestListWeatherFiles:
    @mock_aws
    def test_empty_bucket(self, s3_bucket):
        response = client.get("/list-weather-files")
        assert response.status_code == 200
        assert response.json()["files"] == []

    @mock_aws
    def test_list_with_files(self, s3_bucket_with_file):
        response = client.get("/list-weather-files")
        assert response.status_code == 200
        files = response.json()["files"]
        assert len(files) == 1
        assert files[0]["name"].startswith("weather_")


class TestGetWeatherFileContent:
    @mock_aws
    def test_file_not_found(self, s3_bucket):
        response = client.get("/weather-file-content/nonexistent.json")
        assert response.status_code == 404

    @mock_aws
    def test_file_found(self, s3_bucket_with_file):
        file_name = "weather_52.52_13.41_2024-01-01_2024-01-02_20240101T120000Z.json"
        response = client.get(f"/weather-file-content/{file_name}")
        assert response.status_code == 200
        data = response.json()
        assert "daily" in data

    def test_invalid_file_extension(self):
        response = client.get("/weather-file-content/malicious.exe")
        assert response.status_code == 400


class TestHealthCheck:
    def test_health(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
