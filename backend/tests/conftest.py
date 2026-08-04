import json
import os

import boto3
import pytest
from moto import mock_aws

os.environ["AWS_REGION"] = "us-east-1"
os.environ["S3_BUCKET_NAME"] = "test-weather-bucket"
os.environ["AWS_ACCESS_KEY_ID"] = "testing"
os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"


@pytest.fixture
def s3_bucket():
    with mock_aws():
        s3 = boto3.client("s3", region_name="us-east-1")
        s3.create_bucket(Bucket="test-weather-bucket")
        yield s3


@pytest.fixture
def s3_bucket_with_file(s3_bucket):
    sample_data = {
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
    s3_bucket.put_object(
        Bucket="test-weather-bucket",
        Key="weather_52.52_13.41_2024-01-01_2024-01-02_20240101T120000Z.json",
        Body=json.dumps(sample_data),
        ContentType="application/json",
    )
    return s3_bucket
