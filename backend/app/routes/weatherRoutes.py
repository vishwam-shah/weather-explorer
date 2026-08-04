from fastapi import APIRouter, HTTPException
from httpx import HTTPStatusError

from app.services import storageService, weatherService
from app.validators.weatherValidator import WeatherRequest

router = APIRouter()


@router.post("/store-weather-data")
async def store_weather_data(request: WeatherRequest):
    try:
        data = await weatherService.fetch_weather_data(
            latitude=request.latitude,
            longitude=request.longitude,
            start_date=request.start_date.isoformat(),
            end_date=request.end_date.isoformat(),
        )
    except HTTPStatusError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Open-Meteo API error: {e.response.status_code}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch weather data: {str(e)}",
        )

    try:
        file_name = storageService.generate_file_name(
            latitude=request.latitude,
            longitude=request.longitude,
            start_date=request.start_date.isoformat(),
            end_date=request.end_date.isoformat(),
        )
        storageService.upload_json(file_name, data)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to store data in S3: {str(e)}",
        )

    return {"status": "ok", "file": file_name}


@router.get("/list-weather-files")
async def list_weather_files():
    try:
        files = storageService.list_files()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list files from S3: {str(e)}",
        )
    return {"files": files}


@router.get("/weather-file-content/{file_name:path}")
async def get_weather_file_content(file_name: str):
    if not file_name.endswith(".json"):
        raise HTTPException(status_code=400, detail="Invalid file name")

    try:
        content = storageService.get_file_content(file_name)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve file from S3: {str(e)}",
        )

    if content is None:
        raise HTTPException(
            status_code=404,
            detail={"status": "error", "message": "not found"},
        )

    return content
