"use client";

import { useListWeatherFiles } from "@/hooks/useWeatherApi";
import GlassCard from "./glassCard";

interface StoredFilesProps {
  selectedFile: string | null;
  onSelectFile: (fileName: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseFileName(name: string): string {
  const match = name.match(
    /weather_([-\d.]+)_([-\d.]+)_(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})/
  );
  if (!match) return name;
  return `(${match[1]}, ${match[2]}) ${match[3]} → ${match[4]}`;
}

export default function StoredFiles({
  selectedFile,
  onSelectFile,
}: StoredFilesProps) {
  const { data, isLoading, isError, error, refetch } = useListWeatherFiles();

  return (
    <GlassCard title="Stored Files" icon="folder_open">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] text-[#3c3c43]/40">
          {data?.files?.length ?? 0} file(s)
        </span>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1 text-[13px] text-accent-blue hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8 text-[#3c3c43]/40">
          <span className="material-symbols-outlined animate-spin mr-2">
            progress_activity
          </span>
          <span className="text-[14px]">Loading files...</span>
        </div>
      )}

      {isError && (
        <div className="glass p-3 !bg-[#ff3b30]/8 !border-[#ff3b30]/15">
          <div className="flex items-center gap-2 text-[#ff3b30] text-[13px]">
            <span className="material-symbols-outlined text-base">error</span>
            {error?.message || "Failed to load files"}
          </div>
        </div>
      )}

      {data?.files && data.files.length === 0 && (
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-4xl text-[#3c3c43]/15 mb-2 block">
            cloud_off
          </span>
          <p className="text-[14px] text-[#3c3c43]/40">No files stored yet</p>
          <p className="text-[12px] mt-1 text-[#3c3c43]/30">
            Fetch weather data to see files here
          </p>
        </div>
      )}

      {data?.files && data.files.length > 0 && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {data.files.map((file) => (
            <button
              key={file.name}
              onClick={() => onSelectFile(file.name)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all ${
                selectedFile === file.name
                  ? "bg-accent-blue/10 border border-accent-blue/25 shadow-sm"
                  : "bg-white/40 border border-white/50 hover:bg-white/60 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`material-symbols-outlined text-base mt-0.5 ${
                    selectedFile === file.name
                      ? "text-accent-blue"
                      : "text-[#3c3c43]/30"
                  }`}
                >
                  description
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-[#1c1c1e] truncate">
                    {parseFileName(file.name)}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[12px] text-[#3c3c43]/40">
                    <span>{formatBytes(file.size)}</span>
                    <span>{formatDate(file.created_at)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
