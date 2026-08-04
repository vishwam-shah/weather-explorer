"use client";

import { useMemo } from "react";
import { useWeatherFileContent } from "@/hooks/useWeatherApi";
import type { DailyRow } from "@/types/weather";
import TemperatureChart from "./temperatureChart";
import TemperatureTable from "./temperatureTable";

interface DataVisualizationProps {
  selectedFile: string | null;
}

export default function DataVisualization({
  selectedFile,
}: DataVisualizationProps) {
  const { data, isLoading, isError, error } =
    useWeatherFileContent(selectedFile);

  const rows: DailyRow[] = useMemo(() => {
    if (!data?.daily) return [];
    return data.daily.time.map((date, i) => ({
      date,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      apparentMax: data.daily.apparent_temperature_max[i],
      apparentMin: data.daily.apparent_temperature_min[i],
    }));
  }, [data]);

  const unit = data?.daily_units?.temperature_2m_max || "°C";

  if (!selectedFile) {
    return (
      <div className="glass p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-[#3c3c43]/12 mb-3 block">
          analytics
        </span>
        <p className="text-[#3c3c43]/35 text-[14px]">
          Select a file from the list to visualize weather data
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass p-12 text-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-accent-blue mb-3 block">
          progress_activity
        </span>
        <p className="text-[#3c3c43]/40 text-[14px]">Loading weather data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass p-8 !bg-[#ff3b30]/8 !border-[#ff3b30]/15">
        <div className="flex items-center gap-2 text-[#ff3b30] text-[14px]">
          <span className="material-symbols-outlined">error</span>
          <span>{error?.message || "Failed to load file content"}</span>
        </div>
      </div>
    );
  }

  if (!data?.daily || rows.length === 0) {
    return (
      <div className="glass p-8 text-center">
        <span className="material-symbols-outlined text-4xl text-[#3c3c43]/12 mb-3 block">
          info
        </span>
        <p className="text-[#3c3c43]/35 text-[14px]">
          No daily data available in this file
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data && (
        <div className="glass p-4 flex flex-wrap items-center gap-4 text-[13px] text-[#3c3c43]/60">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-accent-blue">
              location_on
            </span>
            <span>
              {data.latitude?.toFixed(2)}, {data.longitude?.toFixed(2)}
            </span>
          </div>
          {data.timezone && (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-accent-purple">
                schedule
              </span>
              <span>{data.timezone}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-accent-cyan">
              date_range
            </span>
            <span>
              {new Date(rows[0]?.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {" → "}
              {new Date(rows[rows.length - 1]?.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-accent-rose">
              straighten
            </span>
            <span>{rows.length} days</span>
          </div>
        </div>
      )}

      <TemperatureChart data={rows} unit={unit} />
      <TemperatureTable data={rows} unit={unit} />
    </div>
  );
}
