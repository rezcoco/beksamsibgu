import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Protocol API Reference",
    default: "Protocol API Reference",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-full bg-white dark:bg-zinc-900 antialiased",
          inter.className
        )}
      >
        <Providers>
          <div className="w-full">
            <Layout>{children}</Layout>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
