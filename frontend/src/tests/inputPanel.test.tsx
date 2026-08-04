import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InputPanel from "@/components/inputPanel";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("InputPanel", () => {
  it("renders all form fields", () => {
    render(<InputPanel />, { wrapper: createWrapper() });

    expect(screen.getByText("Latitude")).toBeInTheDocument();
    expect(screen.getByText("Longitude")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /fetch & store data/i })
    ).toBeInTheDocument();
  });

  it("renders latitude and longitude inputs with correct placeholders", () => {
    render(<InputPanel />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText("-90 to 90")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("-180 to 180")).toBeInTheDocument();
  });

  it("has required fields", () => {
    render(<InputPanel />, { wrapper: createWrapper() });

    const latInput = screen.getByPlaceholderText("-90 to 90");
    const lonInput = screen.getByPlaceholderText("-180 to 180");

    expect(latInput).toBeRequired();
    expect(lonInput).toBeRequired();
  });
});
