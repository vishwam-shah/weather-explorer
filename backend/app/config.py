import os

from dotenv import load_dotenv

load_dotenv()

IS_LAMBDA = "AWS_LAMBDA_FUNCTION_NAME" in os.environ

if not IS_LAMBDA:
    os.environ.pop("AWS_ACCESS_KEY_ID", None)
    os.environ.pop("AWS_SECRET_ACCESS_KEY", None)
    os.environ.pop("AWS_SESSION_TOKEN", None)

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "weather-explorer-bucket")

OPEN_METEO_BASE_URL = "https://archive-api.open-meteo.com/v1/archive"

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")
