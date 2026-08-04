"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyRow } from "@/types/weather";
import GlassCard from "./glassCard";

interface TemperatureChartProps {
  data: DailyRow[];
  unit?: string;
}

const CHART_COLORS = {
  tempMax: "#ff3b30",
  tempMin: "#007aff",
  apparentMax: "#ff9500",
  apparentMin: "#32ade6",
};

const LEGEND_ITEMS = [
  { key: "tempMax", label: "Max Temp", color: CHART_COLORS.tempMax, dashed: false },
  { key: "tempMin", label: "Min Temp", color: CHART_COLORS.tempMin, dashed: false },
  { key: "apparentMax", label: "Apparent Max", color: CHART_COLORS.apparentMax, dashed: true },
  { key: "apparentMin", label: "Apparent Min", color: CHART_COLORS.apparentMin, dashed: true },
];

function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-5 pt-3 text-[12px] text-[#8e8e93]">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.key} className="flex items-center gap-1.5">
          <svg width="16" height="3">
            <line
              x1="0" y1="1.5" x2="16" y2="1.5"
              stroke={item.color}
              strokeWidth={2}
              strokeDasharray={item.dashed ? "4 3" : "none"}
            />
          </svg>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function TemperatureChart({
  data,
  unit = "°C",
}: TemperatureChartProps) {
  const tickInterval = useMemo(() => {
    if (data.length <= 7) return 0;
    if (data.length <= 14) return 1;
    return Math.ceil(data.length / 10) - 1;
  }, [data.length]);

  if (data.length === 0) return null;

  return (
    <GlassCard title="Temperature Chart" icon="show_chart">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="gradMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff3b30" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#ff3b30" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007aff" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#007aff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(60,60,67,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              interval={tickInterval}
              tick={{ fill: "#8e8e93", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(60,60,67,0.1)" }}
              tickFormatter={(value: string) => {
                const d = new Date(value);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
              tickMargin={8}
            />
            <YAxis
              tick={{ fill: "#8e8e93", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              unit={unit}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: "14px",
                color: "#1c1c1e",
                fontSize: "13px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                padding: "12px 16px",
              }}
              labelFormatter={(label) =>
                new Date(String(label)).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  tempMax: "Max Temp",
                  tempMin: "Min Temp",
                  apparentMax: "Apparent Max",
                  apparentMin: "Apparent Min",
                };
                return [`${value}${unit}`, labels[String(name)] || String(name)];
              }}
            />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="tempMax"
              fill="url(#gradMax)"
              stroke="none"
              legendType="none"
              tooltipType="none"
            />
            <Area
              type="monotone"
              dataKey="tempMin"
              fill="url(#gradMin)"
              stroke="none"
              legendType="none"
              tooltipType="none"
            />
            <Line
              type="monotone"
              dataKey="apparentMin"
              stroke={CHART_COLORS.apparentMin}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="apparentMax"
              stroke={CHART_COLORS.apparentMax}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="tempMin"
              stroke={CHART_COLORS.tempMin}
              strokeWidth={2.5}
              dot={data.length <= 10}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="tempMax"
              stroke={CHART_COLORS.tempMax}
              strokeWidth={2.5}
              dot={data.length <= 10}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
