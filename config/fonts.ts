/**
 * NexEstate — next/font/google configuration
 * Canonical source: projects/nexestate/PRODUCT_IDENTITY.md § Typography
 *
 * Import this in src/app/layout.tsx and apply className + style to <html>.
 *
 * Why these choices:
 *   - Plus Jakarta Sans: SaaS-forward headings, 600-700 only to minimize FOUT
 *   - Inter: System fallback chain — CWV-optimal, no additional payload
 *   - font-display: swap on both — eliminates FOIT, tolerates brief FOUT
 *   - preload: true on Plus Jakarta — critical render path (heading H1 above fold)
 *   - preload: false on Inter — system fallback renders immediately
 */

import { Inter, Plus_Jakarta_Sans } from "next/font/google";

// ------------------------------------------------------------------
// Plus Jakarta Sans — Headings only (H1–H3)
// Weights: 600 (subheading), 700 (display + heading)
// Per PRODUCT_IDENTITY.md: "Preload: Yes — critical render path"
// ------------------------------------------------------------------
export const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-heading",
  preload: true,
  // fallback prevents layout shift while font loads
  fallback: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

// CSS variable name — import in layout for className composition
export const FONT_HEADING_VAR = "--font-heading" as const;

// ------------------------------------------------------------------
// Inter — Body, body-small, emphasis, data, caption
// Weights: 400 (body prose), 500 (emphasis + tabular data)
// Per PRODUCT_IDENTITY.md: "Preload only if NOT using system fallback"
// System fallback covers most devices; preload set to false for FCP.
// ------------------------------------------------------------------
export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-body",
  preload: false, // system fallback chain renders immediately
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    "sans-serif",
  ],
});

// CSS variable name — import in layout for className composition
export const FONT_BODY_VAR = "--font-body" as const;

// ------------------------------------------------------------------
// Convenience export — spread both classNames onto <html> element
// Usage: <html className={fontClassNames}>
// ------------------------------------------------------------------
export const fontClassNames =
  `${fontHeading.variable} ${fontBody.variable}` as const;
