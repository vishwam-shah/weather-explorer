export interface WeatherRequest {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
}

export interface StoreWeatherResponse {
  status: string;
  file: string;
}

export interface WeatherFile {
  name: string;
  size: number;
  created_at: string;
}

export interface ListFilesResponse {
  files: WeatherFile[];
}

export interface WeatherDailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
}

export interface WeatherFileContent {
  latitude: number;
  longitude: number;
  daily: WeatherDailyData;
  daily_units?: Record<string, string>;
  timezone?: string;
  [key: string]: unknown;
}

export interface DailyRow {
  date: string;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
}
