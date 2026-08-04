"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, createSystem, defineConfig } from "@chakra-ui/react";
import { useState, useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

const chakraConfig = defineConfig({
  preflight: false,
  globalCss: {},
});

const system = createSystem(chakraConfig);

function ChakraWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraWrapper>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              color: "#1e293b",
            },
          }}
        />
      </ChakraWrapper>
    </QueryClientProvider>
  );
}
