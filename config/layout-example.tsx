/**
 * NexEstate — Example layout.tsx
 * Drop this into src/app/layout.tsx (adjust imports as needed).
 *
 * Shows how to:
 *   1. Import font objects from fonts.ts
 *   2. Apply CSS variables to <html> so Tailwind tokens resolve
 *   3. Set default font via className (body = Inter baseline)
 *   4. Use font-heading class on heading elements
 *
 * Canonical brand ref: projects/nexestate/PRODUCT_IDENTITY.md
 */

import type { Metadata } from "next";
import { fontBody, fontClassNames } from "./fonts";
import "./globals.css";

// ------------------------------------------------------------------
// Metadata — SEO + OG baseline
// OG image uses /public/assets/og-template.svg as base (BRAND_HANDOFF.md)
// ------------------------------------------------------------------
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
    locale: "es_419", // es-LATAM
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

// ------------------------------------------------------------------
// Root Layout
// - fontClassNames injects --font-heading + --font-body CSS vars
// - fontBody.className sets Inter as the default body font
// - Tailwind class `bg-background text-primary` applies brand canvas
// ------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Apply both font CSS variables at the root element
    <html
      lang="es"
      className={fontClassNames}
      data-testid="root-layout"
    >
      <body
        // font-body = var(--font-body) via tailwind.config fontFamily
        // bg-background = #F5F5F5 canvas
        // text-primary = Navy #1A2B4D default text color
        className={`${fontBody.className} bg-background text-primary antialiased`}
        data-testid="root-body"
      >
        {children}
      </body>
    </html>
  );
}

// ------------------------------------------------------------------
// Usage patterns for consumers
//
// Heading (H1, H2, H3) — Plus Jakarta Sans 700:
//   <h1 className="font-heading text-display font-bold text-primary">
//     Tu inmobiliaria, potenciada.
//   </h1>
//
// Body prose — Inter 400:
//   <p className="font-body text-body text-gray-700">
//     Gestiona propiedades, leads y contratos desde un solo lugar.
//   </p>
//
// Data / tabular numbers — Inter 500 + tabular-nums:
//   <span className="font-body text-body-sm font-medium tabular-nums">
//     $245,000
//   </span>
//
// CTA button — Copper bg, white text (NEVER copper text on white):
//   <button className="bg-accent text-white rounded-sm px-spacing-4 py-spacing-2
//                       transition-colors duration-fast hover:brightness-[0.85]">
//     Ver propiedades
//   </button>
// ------------------------------------------------------------------
