"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWeatherFileContent,
  listWeatherFiles,
  storeWeatherData,
} from "@/lib/apiClient";
import type { WeatherRequest } from "@/types/weather";

export function useStoreWeatherData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WeatherRequest) => storeWeatherData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weatherFiles"] });
    },
  });
}

export function useListWeatherFiles() {
  return useQuery({
    queryKey: ["weatherFiles"],
    queryFn: listWeatherFiles,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useWeatherFileContent(fileName: string | null) {
  return useQuery({
    queryKey: ["weatherFileContent", fileName],
    queryFn: () => getWeatherFileContent(fileName!),
    enabled: !!fileName,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
