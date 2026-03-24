import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontBody, fontClassNames } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NexEstate — Tu inmobiliaria, potenciada.",
    template: "%s | NexEstate",
  },
  description:
    "Inteligencia operativa para agencias inmobiliarias LATAM 5–30 agentes.",
  openGraph: {
    title: "NexEstate",
    description: "Tu inmobiliaria, potenciada.",
    siteName: "NexEstate",
    locale: "es_419",
    type: "website",
    images: [
      {
        url: "/assets/og-template.svg",
        width: 1200,
        height: 630,
        alt: "NexEstate — plataforma para agencias inmobiliarias",
      },
    ],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={fontClassNames} data-testid="root-layout">
      <body
        className={`${fontBody.className} bg-background text-primary antialiased`}
        data-testid="root-body"
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
