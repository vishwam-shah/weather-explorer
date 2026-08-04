"use client";

import { useMemo, useState } from "react";
import type { DailyRow } from "@/types/weather";
import GlassCard from "./glassCard";

interface TemperatureTableProps {
  data: DailyRow[];
  unit?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function TemperatureTable({
  data,
  unit = "°C",
}: TemperatureTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = useMemo(
    () => data.slice(currentPage * pageSize, (currentPage + 1) * pageSize),
    [data, currentPage, pageSize]
  );

  if (data.length === 0) return null;

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  return (
    <GlassCard title="Temperature Data" icon="table_chart">
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-[#f2f2f7]/60">
              <th className="text-left py-3 px-4 text-[#3c3c43]/50 font-semibold text-[12px] uppercase tracking-wider">
                Date
              </th>
              <th className="text-right py-3 px-4 text-[#ff3b30]/70 font-semibold text-[12px] uppercase tracking-wider">
                Max ({unit})
              </th>
              <th className="text-right py-3 px-4 text-[#007aff]/70 font-semibold text-[12px] uppercase tracking-wider">
                Min ({unit})
              </th>
              <th className="text-right py-3 px-4 text-[#ff9500]/70 font-semibold text-[12px] uppercase tracking-wider">
                App. Max ({unit})
              </th>
              <th className="text-right py-3 px-4 text-[#32ade6]/70 font-semibold text-[12px] uppercase tracking-wider">
                App. Min ({unit})
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, i) => (
              <tr
                key={row.date}
                className={`border-b border-[#3c3c43]/5 hover:bg-[#007aff]/[0.04] transition-colors ${
                  i % 2 === 0 ? "bg-white/20" : "bg-transparent"
                }`}
              >
                <td className="py-2.5 px-4 text-[#1c1c1e]/80 font-medium">
                  {new Date(row.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-2.5 px-4 text-right text-[#ff3b30] font-mono tabular-nums">
                  {row.tempMax?.toFixed(1) ?? "—"}
                </td>
                <td className="py-2.5 px-4 text-right text-[#007aff] font-mono tabular-nums">
                  {row.tempMin?.toFixed(1) ?? "—"}
                </td>
                <td className="py-2.5 px-4 text-right text-[#ff9500] font-mono tabular-nums">
                  {row.apparentMax?.toFixed(1) ?? "—"}
                </td>
                <td className="py-2.5 px-4 text-right text-[#32ade6] font-mono tabular-nums">
                  {row.apparentMin?.toFixed(1) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <div className="flex items-center gap-2 text-[13px] text-[#3c3c43]/40">
          <span>Rows per page:</span>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => handlePageSizeChange(size)}
              className={`px-2.5 py-1 rounded-lg transition-colors text-[13px] ${
                pageSize === size
                  ? "bg-accent-blue/10 text-accent-blue font-medium"
                  : "hover:bg-white/50 text-[#3c3c43]/40"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[#3c3c43]/60">
              chevron_left
            </span>
          </button>
          <span className="text-[13px] text-[#3c3c43]/40 min-w-[80px] text-center">
            {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={currentPage >= totalPages - 1}
            className="p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[#3c3c43]/60">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
