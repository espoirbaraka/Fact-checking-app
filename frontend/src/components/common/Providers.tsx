"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthBootstrap } from "@/components/common/AuthBootstrap";
import { useEffect, useState, type ReactNode } from "react";
import { useLocaleStore } from "@/store/locale.store";

function LocaleHtmlLang() {
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider delayDuration={300}>
          <LocaleHtmlLang />
          <AuthBootstrap>{children}</AuthBootstrap>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
