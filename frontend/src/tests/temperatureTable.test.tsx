import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TemperatureTable from "@/components/temperatureTable";
import type { DailyRow } from "@/types/weather";

const mockData: DailyRow[] = Array.from({ length: 25 }, (_, i) => ({
  date: `2024-01-${String(i + 1).padStart(2, "0")}`,
  tempMax: 5 + i * 0.5,
  tempMin: -2 + i * 0.3,
  apparentMax: 3 + i * 0.4,
  apparentMin: -4 + i * 0.2,
}));

describe("TemperatureTable", () => {
  it("renders table with correct headers", () => {
    render(<TemperatureTable data={mockData} />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Max (°C)")).toBeInTheDocument();
    expect(screen.getByText("Min (°C)")).toBeInTheDocument();
    expect(screen.getByText("App. Max (°C)")).toBeInTheDocument();
    expect(screen.getByText("App. Min (°C)")).toBeInTheDocument();
  });

  it("shows 10 rows by default", () => {
    render(<TemperatureTable data={mockData} />);

    const rows = screen.getAllByRole("row");
    // 1 header row + 10 data rows
    expect(rows.length).toBe(11);
  });

  it("changes page size when clicking size buttons", () => {
    render(<TemperatureTable data={mockData} />);

    const button20 = screen.getByRole("button", { name: "20" });
    fireEvent.click(button20);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(21); // 1 header + 20 data
  });

  it("paginates correctly", () => {
    render(<TemperatureTable data={mockData} />);

    expect(screen.getByText("1 of 3")).toBeInTheDocument();

    const nextButton = screen.getAllByText("chevron_right")[0].closest("button");
    if (nextButton) fireEvent.click(nextButton);

    expect(screen.getByText("2 of 3")).toBeInTheDocument();
  });

  it("returns null when data is empty", () => {
    const { container } = render(<TemperatureTable data={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
