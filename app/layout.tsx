import type { Metadata } from "next";
import { SkipLink } from "@/components/v2/SkipLink";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vouchstarterkit.netlify.app"),
  title: {
    default: "Vouch Starter Kit 2.0 — Open-source business decision intelligence",
    template: "%s · Vouch Starter Kit",
  },
  description:
    "Find where a business journey is breaking and decide what deserves attention next. Analyse CSV/XLSX locally, inspect deterministic rules, compare reviews and build industry packs.",
  applicationName: "Vouch Starter Kit",
  authors: [{ name: "Vouch", url: "https://yourvouch.com" }],
  creator: "Vouch",
  publisher: "Vouch",
  category: "Business intelligence",
  keywords: [
    "business decision intelligence",
    "open source business intelligence",
    "CSV analysis",
    "XLSX analysis",
    "sales pipeline analysis",
    "customer journey analysis",
    "local-first software",
    "TypeScript rules engine",
    "vertical SaaS",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Vouch Starter Kit",
    title: "Find the break. Decide what deserves attention next.",
    description:
      "Open-source, local-first decision intelligence for business CSV/XLSX data. Explore finished examples or build a pack for your industry.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Vouch Starter Kit 2.0" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vouch Starter Kit 2.0",
    description: "Open-source business decision intelligence. Local-first, explainable and extensible.",
    images: ["/opengraph-image"],
  },
};

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
