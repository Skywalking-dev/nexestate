/**
 * NexEstate — Tailwind CSS v4 Config
 * Canonical source: projects/nexestate/PRODUCT_IDENTITY.md
 * All tokens derive from that doc — do not diverge.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
  ],

  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",

      // Brand primaries (PRODUCT_IDENTITY.md § Palette)
      primary: "var(--color-primary)",       // Navy #1A2B4D
      accent: "var(--color-accent)",         // Copper #B8832A — CTAs only
      background: "var(--color-background)", // #F5F5F5

      // Corporate gray scale
      gray: {
        50: "var(--color-gray-50)",
        100: "var(--color-gray-100)",
        200: "var(--color-gray-200)",
        300: "var(--color-gray-300)",
        400: "var(--color-gray-400)",
        500: "var(--color-gray-500)",
        600: "var(--color-gray-600)",
        700: "var(--color-gray-700)",
        800: "var(--color-gray-800)",
      },

      // Status colors
      success: "var(--color-success)",
      error: "var(--color-error)",
      warning: "var(--color-warning)",
      info: "var(--color-info)",
    },

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
      mono: ["var(--font-body)", "monospace"],
    },

    extend: {
      spacing: {
        "spacing-1": "var(--spacing-1)",
        "spacing-2": "var(--spacing-2)",
        "spacing-3": "var(--spacing-3)",
        "spacing-4": "var(--spacing-4)",
        "spacing-5": "var(--spacing-5)",
        "spacing-6": "var(--spacing-6)",
        "spacing-8": "var(--spacing-8)",
        "spacing-10": "var(--spacing-10)",
        "spacing-12": "var(--spacing-12)",
        "spacing-16": "var(--spacing-16)",
        "spacing-20": "var(--spacing-20)",
        "spacing-24": "var(--spacing-24)",
      },

      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        full: "50%",
      },

      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
        form: "200ms",
      },

      transitionTimingFunction: {
        brand: "cubic-bezier(0.4, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0.2, 0.2, 1)",
      },

      fontSize: {
        display: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        heading: ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        subheading: ["1.5rem", { lineHeight: "1.2", letterSpacing: "0" }],
        body: ["1rem", { lineHeight: "1.5", letterSpacing: "0" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
        label: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
      },

      maxWidth: {
        content: "1280px",
        form: "500px",
      },

      boxShadow: {
        focus: "0 0 0 3px rgba(184, 131, 42, 0.1)",
        none: "none",
      },

      screens: {
        sm: "640px",
        md: "1024px",
        lg: "1440px",
      },
    },
  },

  plugins: [],
};

export default config;
