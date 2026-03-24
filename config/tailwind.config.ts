/**
 * NexEstate — Tailwind CSS v4 Config
 * Canonical source: projects/nexestate/PRODUCT_IDENTITY.md
 * All tokens derive from that doc — do not diverge.
 *
 * Usage (tailwind.config.ts at project root):
 *   import config from './tailwind.config'
 *   export default config
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
  ],

  theme: {
    // ------------------------------------------------------------------
    // Full color override — we own the full scale.
    // All values reference CSS custom properties from globals.css
    // so a single :root patch is enough to theme the whole app.
    // ------------------------------------------------------------------
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",

      // Brand primaries (PRODUCT_IDENTITY.md § Palette)
      primary: "var(--color-primary)",   // Navy #1A2B4D — structure, trust
      accent: "var(--color-accent)",     // Copper #B8832A — CTAs only
      background: "var(--color-background)", // #F5F5F5 — canvas

      // Corporate gray scale (§ Supporting Grays)
      gray: {
        50: "var(--color-gray-50)",   // #F9FAFB — hover states
        100: "var(--color-gray-100)", // #F3F4F6 — card borders
        200: "var(--color-gray-200)", // #E5E7EB — form borders
        300: "var(--color-gray-300)", // #D1D5DB — disabled inputs
        400: "var(--color-gray-400)", // #9CA3AF — placeholder text
        500: "var(--color-gray-500)", // #6B7280 — secondary text (minimum 4.5:1)
        600: "var(--color-gray-600)", // #4B5563 — tertiary text
        700: "var(--color-gray-700)", // #374151 — strong contrast text
        800: "var(--color-gray-800)", // #1F2937 — highest contrast text
      },

      // Semantic status colors (§ Status Colors)
      // Note: error uses #DC2626 (darker than spec raw) for WCAG AA 4.5:1
      success: "var(--color-success)", // #10B981
      error: "var(--color-error)",     // #DC2626
      warning: "var(--color-warning)", // #F59E0B
      info: "var(--color-info)",       // #3B82F6
    },

    // ------------------------------------------------------------------
    // Font families (§ Typography — Font Stack)
    // Variables injected by next/font in fonts.ts
    // ------------------------------------------------------------------
    fontFamily: {
      heading: ["var(--font-heading)", "sans-serif"],
      body: [
        "var(--font-body)",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        "sans-serif",
      ],
      // Inter 500 + tabular-nums for pricing / data grids
      mono: ["var(--font-body)", "monospace"],
    },

    // ------------------------------------------------------------------
    // Spacing — 4px base grid (§ Spacing System)
    // Tailwind default is 4px base so numeric tokens match.
    // Extra named tokens cover the full PRODUCT_IDENTITY.md scale.
    // ------------------------------------------------------------------
    extend: {
      spacing: {
        // Named spacing tokens for explicit intent
        "spacing-1": "var(--spacing-1)",   // 4px
        "spacing-2": "var(--spacing-2)",   // 8px
        "spacing-3": "var(--spacing-3)",   // 12px
        "spacing-4": "var(--spacing-4)",   // 16px
        "spacing-5": "var(--spacing-5)",   // 20px
        "spacing-6": "var(--spacing-6)",   // 24px
        "spacing-8": "var(--spacing-8)",   // 32px
        "spacing-10": "var(--spacing-10)", // 40px
        "spacing-12": "var(--spacing-12)", // 48px
        "spacing-16": "var(--spacing-16)", // 64px
        "spacing-20": "var(--spacing-20)", // 80px
        "spacing-24": "var(--spacing-24)", // 96px
      },

      // ------------------------------------------------------------------
      // Border radius (§ Component Principles — Border Radius)
      // ------------------------------------------------------------------
      borderRadius: {
        // Override Tailwind defaults with brand tokens
        sm: "6px",   // buttons, inputs
        md: "8px",   // cards
        lg: "12px",  // modals, dropdowns
        full: "50%", // avatars, icons
      },

      // ------------------------------------------------------------------
      // Transition durations (§ Animation & Motion — Timing Tokens)
      // ------------------------------------------------------------------
      transitionDuration: {
        fast: "var(--duration-fast)",     // 150ms — button hover
        normal: "var(--duration-normal)", // 300ms — modal open
        slow: "var(--duration-slow)",     // 400ms — lazy reveal
        form: "200ms",                    // form state (focus/error)
      },

      // ------------------------------------------------------------------
      // Transition timing functions (§ Animation & Motion)
      // ------------------------------------------------------------------
      transitionTimingFunction: {
        brand: "cubic-bezier(0.4, 0, 0.2, 1)", // standard transition
        "in-out": "cubic-bezier(0.4, 0.2, 0.2, 1)", // form state
      },

      // ------------------------------------------------------------------
      // Typography scale (§ Typography — Scale)
      // fontSize: [size, { lineHeight, letterSpacing }]
      // ------------------------------------------------------------------
      fontSize: {
        display: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],   // 48px H1
        heading: ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }], // 36px H2
        subheading: ["1.5rem", { lineHeight: "1.2", letterSpacing: "0" }],     // 24px H3
        body: ["1rem", { lineHeight: "1.5", letterSpacing: "0" }],             // 16px body
        "body-sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.01em" }], // 14px
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],  // 12px
        label: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],  // 13px
      },

      // ------------------------------------------------------------------
      // Max widths / container (§ Spacing — Container Queries)
      // ------------------------------------------------------------------
      maxWidth: {
        content: "1280px", // main content area
        form: "500px",     // forms — full width mobile, capped on desktop
      },

      // ------------------------------------------------------------------
      // Box shadow — elevation via color, not shadows (§ Component Principles)
      // Only focus ring here; no decorative shadows.
      // ------------------------------------------------------------------
      boxShadow: {
        focus: "0 0 0 3px rgba(184, 131, 42, 0.1)", // copper focus ring
        none: "none",
      },

      // ------------------------------------------------------------------
      // Screens / breakpoints (§ Responsive Breakpoints)
      // ------------------------------------------------------------------
      screens: {
        sm: "640px",   // tablet
        md: "1024px",  // desktop
        lg: "1440px",  // large desktop
      },
    },
  },

  plugins: [],
};

export default config;
