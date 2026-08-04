import type {
  ListFilesResponse,
  StoreWeatherResponse,
  WeatherFileContent,
  WeatherRequest,
} from "@/types/weather";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: response.statusText,
    }));
    throw new Error(
      typeof error.detail === "string"
        ? error.detail
        : JSON.stringify(error.detail)
    );
  }

  return response.json();
}

export function storeWeatherData(
  data: WeatherRequest
): Promise<StoreWeatherResponse> {
  return request<StoreWeatherResponse>("/store-weather-data", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listWeatherFiles(): Promise<ListFilesResponse> {
  return request<ListFilesResponse>("/list-weather-files");
}

export function getWeatherFileContent(
  fileName: string
): Promise<WeatherFileContent> {
  return request<WeatherFileContent>(
    `/weather-file-content/${encodeURIComponent(fileName)}`
  );
}
