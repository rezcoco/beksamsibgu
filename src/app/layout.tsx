import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Beksamsibgu",
    default: "Pustaka Kosa Kata Korea",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={cn(
          "flex min-h-full bg-white dark:bg-zinc-900 antialiased",
          inter.className
        )}
      >
        <Providers>
          <Analytics />
          <SpeedInsights />
          <div className="w-full">
            {children}
            <Toaster
              toastOptions={{
                success: {
                  style: { background: "#f0fdf4", color: "#166534" },
                },
                error: {
                  style: { background: "#fef2f2", color: "#b91c1c" },
                },
              }}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
