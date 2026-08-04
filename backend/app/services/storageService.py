import json
import os
import configparser
from datetime import datetime, timezone
from pathlib import Path

import boto3
from botocore.exceptions import ClientError

from app.config import AWS_REGION, S3_BUCKET_NAME

IS_LAMBDA = "AWS_LAMBDA_FUNCTION_NAME" in os.environ


def _get_s3_client():
    if IS_LAMBDA:
        return boto3.client("s3", region_name=AWS_REGION)

    for key in ("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN"):
        os.environ.pop(key, None)

    creds_path = Path.home() / ".aws" / "credentials"
    if creds_path.exists():
        config = configparser.ConfigParser()
        config.read(str(creds_path))
        if "default" in config:
            return boto3.client(
                "s3",
                region_name=AWS_REGION,
                aws_access_key_id=config["default"].get("aws_access_key_id"),
                aws_secret_access_key=config["default"].get("aws_secret_access_key"),
            )

    session = boto3.Session(region_name=AWS_REGION)
    return session.client("s3")


def generate_file_name(
    latitude: float,
    longitude: float,
    start_date: str,
    end_date: str,
) -> str:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    return f"weather_{latitude}_{longitude}_{start_date}_{end_date}_{timestamp}.json"


def upload_json(file_name: str, data: dict) -> str:
    s3 = _get_s3_client()
    s3.put_object(
        Bucket=S3_BUCKET_NAME,
        Key=file_name,
        Body=json.dumps(data, indent=2),
        ContentType="application/json",
    )
    return file_name


def list_files() -> list[dict]:
    s3 = _get_s3_client()
    response = s3.list_objects_v2(Bucket=S3_BUCKET_NAME)

    if "Contents" not in response:
        return []

    return [
        {
            "name": obj["Key"],
            "size": obj["Size"],
            "created_at": obj["LastModified"].isoformat(),
        }
        for obj in response["Contents"]
        if obj["Key"].endswith(".json")
    ]


def get_file_content(file_name: str) -> dict:
    s3 = _get_s3_client()
    try:
        response = s3.get_object(Bucket=S3_BUCKET_NAME, Key=file_name)
        return json.loads(response["Body"].read().decode("utf-8"))
    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            return None
        raise
