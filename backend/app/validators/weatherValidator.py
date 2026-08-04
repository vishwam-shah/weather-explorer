from datetime import date, timedelta

from pydantic import BaseModel, field_validator, model_validator


class WeatherRequest(BaseModel):
    latitude: float
    longitude: float
    start_date: date
    end_date: date

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not -90 <= v <= 90:
            raise ValueError("Latitude must be between -90 and 90")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not -180 <= v <= 180:
            raise ValueError("Longitude must be between -180 and 180")
        return v

    @model_validator(mode="after")
    def validate_date_range(self) -> "WeatherRequest":
        if self.end_date >= date.today():
            raise ValueError("end_date must be a historical date (before today)")
        if self.start_date > self.end_date:
            raise ValueError("start_date must be on or before end_date")
        delta = (self.end_date - self.start_date).days
        if delta > 31:
            raise ValueError("Date range must not exceed 31 days")
        return self
