/**
 * NexEstate — next/font/google configuration
 * Canonical source: projects/nexestate/PRODUCT_IDENTITY.md § Typography
 *
 * Import this in src/app/layout.tsx and apply className + style to <html>.
 */

import { Inter, Plus_Jakarta_Sans } from "next/font/google";

// Plus Jakarta Sans — Headings only (H1–H3)
// Weights: 600 (subheading), 700 (display + heading)
export const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-heading",
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

export const FONT_HEADING_VAR = "--font-heading" as const;

// Inter — Body, body-small, emphasis, data, caption
// Weights: 400 (body prose), 500 (emphasis + tabular data)
export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-body",
  preload: false,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    "sans-serif",
  ],
});

export const FONT_BODY_VAR = "--font-body" as const;

// Spread both classNames onto <html> element
export const fontClassNames =
  `${fontHeading.variable} ${fontBody.variable}` as const;
