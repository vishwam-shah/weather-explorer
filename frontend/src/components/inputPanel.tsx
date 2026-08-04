"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useStoreWeatherData } from "@/hooks/useWeatherApi";
import GlassCard from "./glassCard";

export default function InputPanel() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const mutation = useStoreWeatherData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      toast.error("Latitude must be between -90 and 90");
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      toast.error("Longitude must be between -180 and 180");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (startDate > endDate) {
      toast.error("Start date must be before end date");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > 31) {
      toast.error("Date range must not exceed 31 days");
      return;
    }

    mutation.mutate(
      {
        latitude: lat,
        longitude: lon,
        start_date: startDate,
        end_date: endDate,
      },
      {
        onSuccess: (data) => {
          toast.success(`Data stored successfully: ${data.file}`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to fetch and store weather data");
        },
      }
    );
  };

  return (
    <GlassCard title="Fetch Weather Data" icon="cloud_download">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#3c3c43]/60 mb-1.5">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-90 to 90"
              className="glass-input w-full px-4 py-2.5 text-[15px]"
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#3c3c43]/60 mb-1.5">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="-180 to 180"
              className="glass-input w-full px-4 py-2.5 text-[15px]"
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#3c3c43]/60 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-[15px]"
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#3c3c43]/60 mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-[15px]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="glass-button w-full flex items-center justify-center gap-2 text-[15px]"
        >
          {mutation.isPending ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
              Fetching & Storing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">
                cloud_download
              </span>
              Fetch & Store Data
            </>
          )}
        </button>

        {mutation.isSuccess && mutation.data && (
          <div className="glass p-3 !bg-[#34c759]/10 !border-[#34c759]/20">
            <div className="flex items-center gap-2 text-[#248a3d] text-[13px]">
              <span className="material-symbols-outlined text-base shrink-0">
                check_circle
              </span>
              <span className="truncate" title={mutation.data.file}>
                Stored: {mutation.data.file}
              </span>
            </div>
          </div>
        )}
      </form>
    </GlassCard>
  );
}
