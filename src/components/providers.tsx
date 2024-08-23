"use client";

import { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { QueryClientProvider, QueryClient } from "react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    let media = window.matchMedia("(prefers-color-scheme: dark)");

    function onMediaChange() {
      let systemTheme = media.matches ? "dark" : "light";
      if (resolvedTheme === systemTheme) {
        setTheme("system");
      }
    }

    onMediaChange();
    media.addEventListener("change", onMediaChange);

    return () => {
      media.removeEventListener("change", onMediaChange);
    };
  }, [resolvedTheme, setTheme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const pathname = usePathname();

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <ClerkProvider afterSignOutUrl={pathname}>
        <QueryClientProvider client={queryClient}>
          <ThemeWatcher />
          {children}
        </QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
