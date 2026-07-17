import type { Metadata } from "next";
import { SkipLink } from "@/components/v2/SkipLink";
import "./globals.css";

export const metadata: Metadata = { title: "Vouch — Founder Decision Review", description: "Turn your business data into clear priorities and actions, entirely inside your browser." };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
