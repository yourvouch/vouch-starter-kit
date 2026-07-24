import type { Metadata } from "next";
import { SkipLink } from "@/components/v2/SkipLink";
import "./globals.css";

export const metadata: Metadata = { title: "Vouch Starter Kit 2.0 Preview", description: "Local-first open-source decision intelligence engine and reference app for explainable CSV/XLSX business analysis." };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col font-sans">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
