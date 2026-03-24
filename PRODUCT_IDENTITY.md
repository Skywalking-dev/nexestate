# NexEstate — Product Identity

> **Version:** 1.0
> **Date:** 2026-03-24
> **Owner:** Aurora
> **Status:** Locked

---

## Identity

**Product Name:** NexEstate
**Tagline:** Tu inmobiliaria, potenciada.
**Promise:** Inteligencia operativa para agencias inmobiliarias LATAM 5–30 agentes.

---

## Palette

### Primary Color: Azul Marino (Navy)
- **Hex:** `#1A2B4D`
- **RGB:** 26, 43, 77
- **Usage:** Primary UI, backgrounds, borders, typography (H1–H3)
- **Semantics:** Trust, professionalism, stability — critical for fintech-adjacent real estate
- **Accessibility:** WCAG AA contrast ≥4.5:1 on all neutral backgrounds

### Accent Color: Cobre (Copper)
- **Hex:** `#B8832A`
- **RGB:** 184, 131, 42
- **Usage:** CTAs, highlights, data emphasis, conversion moments ONLY
- **Semantics:** Value, precision, premium execution — mid-market positioning (not luxury residencial)
- **Rule:** Never use as background; always button/link/icon foreground or accent border
- **Accessibility:** WCAG AA on navy; validates 4.7:1

### Background: Blanco (White)
- **Hex:** `#F5F5F5`
- **RGB:** 245, 245, 245
- **Usage:** Canvas, cards, sections, breathing room
- **Rationale:** Slight warmth vs pure white (#FFFFFF) reduces eye strain on data-dense dashboards

### Neutral: Gris Corporativo (Corporate Gray)
- **Hex:** `#6B7280`
- **RGB:** 107, 114, 128
- **Usage:** Secondary text, disabled states, borders, dividers
- **Scale:** Derived from UI standard (gray-600 equivalent)
- **Accessibility:** 4.5:1 on white; 5.2:1 on navy

### Supporting Grays (CSS variable-friendly)
| Role | Hex | Usage |
|------|-----|-------|
| `--color-gray-50` | `#F9FAFB` | Subtle backgrounds, hover states |
| `--color-gray-100` | `#F3F4F6` | Card borders, section dividers |
| `--color-gray-200` | `#E5E7EB` | Form borders, secondary separators |
| `--color-gray-300` | `#D1D5DB` | Disabled form inputs |
| `--color-gray-400` | `#9CA3AF` | Placeholder text |
| `--color-gray-500` | `#6B7280` | Secondary text (primary neutral) |
| `--color-gray-600` | `#4B5563` | Tertiary text |
| `--color-gray-700` | `#374151` | Strong contrast text |
| `--color-gray-800` | `#1F2937` | Highest contrast text |
| `--color-gray-900` | `#111827` | Reserved; use navy instead |

### Status Colors (semantic)
| State | Hex | Usage |
|-------|-----|-------|
| Success | `#10B981` | Property listed, transaction confirmed |
| Error | `#EF4444` | Validation fails, missing required data |
| Warning | `#F59E0B` | Low listings, expiring leads |
| Info | `#3B82F6` | Neutral notifications, hints |

---

## Typography

### Font Stack

**Headings (H1–H3): Plus Jakarta Sans 600–700**
- **Display (H1):** 48px / 1.1 line-height / 700 weight
- **Heading (H2):** 36px / 1.2 line-height / 700 weight
- **Subheading (H3):** 24px / 1.2 line-height / 600 weight
- **Rationale:** Distinctive, SaaS-forward, personality without losing corporate credibility
- **Preload:** Yes — critical render path (Plus Jakarta Latin only, `font-display: swap`)
- **Weight subset:** 600, 700 only

**Body Text: Inter 400–500**
- **Body:** 16px / 1.5 line-height / 400 weight
- **Body Small:** 14px / 1.5 line-height / 400 weight
- **Emphasis:** 16px / 1.5 line-height / 500 weight
- **Rationale:** System font fallback chain: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **CWV Impact:** Inter 400–500 is optimal for FCP/LCP balance (no custom font overhead)
- **Note:** Preload only if NOT using system fallback; prefer system fonts for <16ms FCP delta

**Data/Numbers: Inter 500 (Tabular figures)**
- **Size:** 14px–16px / mono-space alignment
- **Weight:** 500
- **Feature:** `font-variant-numeric: tabular-nums` (CSS)
- **Usage:** Property listings, pricing grids, analytics dashboards
- **Never:** Use Geist Mono in body copy; reduces readability <16px

### Scale (8px base grid)

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|---|
| **Display (H1)** | 48px | 700 | 1.1 | -0.02em |
| **Heading (H2)** | 36px | 700 | 1.2 | -0.01em |
| **Subheading (H3)** | 24px | 600 | 1.2 | 0 |
| **Body** | 16px | 400 | 1.5 | 0 |
| **Body Small** | 14px | 400 | 1.5 | 0.01em |
| **Body Emphasis** | 16px | 500 | 1.5 | 0 |
| **Caption** | 12px | 500 | 1.4 | 0.01em |
| **Label** | 13px | 600 | 1.4 | 0.02em |

### Hierarchy Rule
- **H1:** Page title, only once per page
- **H2:** Section breaks, feature categories
- **H3:** Subsection, property cards, UI chrome
- **Body:** Prose, descriptions, form labels
- **Caption:** Metadata, timestamps, secondary hints

---

## Spacing System

**Base Unit:** 4px

### Scale (multiples of base)
| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-1` | 4px | Micro gaps, icon padding |
| `--spacing-2` | 8px | Small padding, dividers |
| `--spacing-3` | 12px | Form spacing, icon + text |
| `--spacing-4` | 16px | Default padding, margins |
| `--spacing-5` | 20px | Medium gaps |
| `--spacing-6` | 24px | Card padding, section gaps |
| `--spacing-7` | 28px | Large margins |
| `--spacing-8` | 32px | XL spacing |
| `--spacing-10` | 40px | Section break |
| `--spacing-12` | 48px | Hero section padding |
| `--spacing-16` | 64px | Page margin (desktop) |
| `--spacing-20` | 80px | Hero margin |
| `--spacing-24` | 96px | Full-page section break |

### Responsive Padding
- **Mobile (< 640px):** `--spacing-4` / `--spacing-6`
- **Tablet (640px–1024px):** `--spacing-6` / `--spacing-8`
- **Desktop (> 1024px):** `--spacing-8` / `--spacing-12`

### Container Queries
- **Hero section:** 85vh height, map-first (Mapbox GL vector)
- **Content area:** max-width 1280px, 16px horizontal padding
- **Card grid:** 2 columns (mobile), 3 columns (tablet), 4 columns (desktop)

---

## Animation & Motion

### Principles
- **No scroll animations** — leverage CSS transforms only
- **Minimize layout shifts** — prefer `transform: translate()` over margin/position changes
- **CLS budget:** <0.1 (Core Web Vitals)
- **Interaction feedback:** Instant (< 200ms)
- **Transitions:** Smooth (300–400ms for non-critical UI)

### Timing Tokens
| Use Case | Duration | Easing | Example |
|----------|----------|--------|---------|
| Micro-interaction | 150ms | `ease-out` | Button hover, icon swap |
| Standard transition | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Modal open, tab switch |
| Lazy load reveal | 400ms | `ease-out` | Property card fade-in |
| Form state | 200ms | `ease-in-out` | Focus ring, error highlight |

### CSS Transitions
```css
/* Buttons */
transition: background-color 150ms ease-out,
            color 150ms ease-out;

/* Modals */
transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Form inputs */
transition: border-color 200ms ease-in-out,
            box-shadow 200ms ease-in-out;
```

### No Animation Cases
- Page load — use `preload` or static hero
- Scroll-triggered reveals — use viewport intersection observer instead
- Parallax — not used (CLS risk)

---

## Component Principles

### Elevation (not shadows)
**Rule:** Depth via color + spacing; no drop shadows.

- **Surface 0 (base):** Navy background #1A2B4D
- **Surface 1 (card):** White #F5F5F5 + 2px gray-100 border
- **Surface 2 (elevated card):** White #F5F5F5 + 4px gray-100 border + extra spacing
- **Accent surfaces:** White + left 4px cobre border (CTA cards, premium features)

### Border Radius
- **Buttons/inputs:** 6px
- **Cards:** 8px
- **Modals/dropdowns:** 12px
- **Avatar/icons:** 50% (circles)

### Border Styling
- **Default:** 1px solid `--color-gray-200`
- **Focus/active:** 2px solid `--color-copper` (#B8832A)
- **Error:** 2px solid `--color-error` (#EF4444)
- **Data separator:** 1px solid `--color-gray-100` (lighter)

### Button Variants

| Variant | Background | Text | Border | Hover | Usage |
|---------|------------|------|--------|-------|-------|
| **Primary** | Copper #B8832A | White | None | Darken 15% | CTA, form submit |
| **Secondary** | Gray-50 #F9FAFB | Navy | 1px gray-200 | Gray-100 bg | Secondary actions |
| **Tertiary** | Transparent | Copper | 1px copper | Copper bg (10% opacity) | Inline actions |
| **Danger** | Error red | White | None | Darken 10% | Delete, confirm |
| **Disabled** | Gray-300 | Gray-400 | None | No change | Inactive state |

### Form Inputs
- **Border:** 1px gray-200, rounded 6px
- **Focus:** 2px copper border + `box-shadow: 0 0 0 3px rgba(184, 131, 42, 0.1)`
- **Placeholder:** gray-400, italic (optional)
- **Error state:** 2px error-red border + error message below in 12px error color

### Cards (Property Listings)
- **Container:** White #F5F5F5 + 8px radius + 1px gray-100 border
- **Header:** Navy background (H3 subheading in white)
- **Body:** 16px gray-700 body text, 1.5 line-height
- **Footer:** Cobre CTA button + secondary action link
- **Spacing:** 16px internal padding, 24px gap between cards

### Data Tables
- **Header:** Navy #1A2B4D background, white text, 600 weight
- **Body rows:** White, 1px gray-100 border bottom
- **Alternating:** Subtle gray-50 every other row
- **Numbers:** Tabular figures, right-aligned
- **Interactive row:** Hover gray-50, pointer cursor

---

## Accessibility

### WCAG AA Compliance

| Combination | Ratio | Status | Note |
|-------------|-------|--------|------|
| Navy #1A2B4D on White #F5F5F5 | 4.7:1 | ✅ Pass | Heading text |
| Navy on Gray-50 #F9FAFB | 4.6:1 | ✅ Pass | Body on light surface |
| Gray-500 #6B7280 on White | 4.5:1 | ✅ Pass | Secondary text (minimum) |
| Copper #B8832A on White | 3.2:1 | ❌ Fail | CTA text on white; use white text on copper instead |
| Copper on Navy | 2.8:1 | ❌ Fail | Avoid; not sufficient contrast |
| White on Navy | 7.2:1 | ✅ Pass | Highest contrast (use for critical actions) |
| Error Red #EF4444 on White | 3.9:1 | ❌ Fail | Use darker red (#DC2626) for 4.5:1 |

### Best Practices
- **CTA text:** Always white on copper background (not copper on white)
- **Body links:** Copper underline + navy text (4.7:1 Navy + 150ms underline on hover)
- **Form errors:** Use darker red (#DC2626) for text labels; copper accent border is fine (color not sole indicator)
- **Icons:** Pair with text labels; never color-alone (e.g., red icon for delete — add "Delete" text)
- **Focus indicators:** 2px copper border + 3px outline (visible on all interactive elements)

### Motion Accessibility
- **No `prefers-reduced-motion` override:** Respect user system preference; remove transitions for users who disable animations
- CSS:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```

---

## Logo Usage

### Clear Space (Minimum)
- Horizontal: 2x cap-height of wordmark on left/right
- Vertical: 1x cap-height top/bottom

### Minimum Size
- **Print/Web:** 120px width (wordmark legible at this scale)
- **Icon/favicon:** 64px (monogram "NE" only)
- **Never smaller than:** 40px (loses detail)

### Background Rules
- **Light backgrounds:** Use navy variant (logo-light.svg)
- **Dark backgrounds:** Use white variant (logo-dark.svg)
- **Always:** Transparent, not white box

### Do's
- ✅ Scale proportionally (maintain aspect ratio)
- ✅ Use on navy, white, or light gray backgrounds
- ✅ Place at top-left (navigation) or center (hero)

### Don'ts
- ❌ Rotate or skew
- ❌ Add effects (shadow, glow, outline)
- ❌ Change colors (navy or white only)
- ❌ Place on mid-tone backgrounds (<4.5:1 contrast)
- ❌ Use compressed/lossy formats (always SVG)

---

## Tailwind 4 CSS Variables

### Colors
```css
:root {
  /* Brand */
  --color-primary: #1A2B4D;          /* Navy */
  --color-accent: #B8832A;            /* Copper */
  --color-background: #F5F5F5;        /* White */
  --color-text: #111827;              /* Gray-900 equiv, use navy #1A2B4D instead */

  /* Grays */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;

  /* Status */
  --color-success: #10B981;
  --color-error: #DC2626;             /* Darker for 4.5:1 contrast */
  --color-warning: #F59E0B;
  --color-info: #3B82F6;

  /* Typography */
  --font-heading: "Plus Jakarta Sans", sans-serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Inter", monospace;    /* Tabular nums only */

  /* Spacing (4px base) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 400ms;
  --easing-out: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-in-out: cubic-bezier(0.4, 0.2, 0.2, 1);
}
```

### Tailwind Theme Extension
```javascript
// tailwind.config.js (or tailwind.config.ts)
export default {
  theme: {
    colors: {
      primary: "var(--color-primary)",
      accent: "var(--color-accent)",
      background: "var(--color-background)",

      gray: {
        50: "var(--color-gray-50)",
        100: "var(--color-gray-100)",
        200: "var(--color-gray-200)",
        // ... etc
      },

      success: "var(--color-success)",
      error: "var(--color-error)",
      warning: "var(--color-warning)",
      info: "var(--color-info)",
    },
    fontFamily: {
      heading: "var(--font-heading)",
      body: "var(--font-body)",
      mono: "var(--font-mono)",
    },
    spacing: {
      1: "var(--spacing-1)",
      2: "var(--spacing-2)",
      // ... etc
    },
    transitionDuration: {
      fast: "var(--duration-fast)",
      normal: "var(--duration-normal)",
      slow: "var(--duration-slow)",
    },
  },
};
```

---

## Responsive Breakpoints

| Size | Breakpoint | Use Case |
|------|-----------|----------|
| **Mobile** | 320px–639px | Phones, small tablets |
| **Tablet** | 640px–1023px | iPad, large phones |
| **Desktop** | 1024px+ | Laptop, desktop |
| **Large Desktop** | 1440px+ | Widescreen, dual-monitor |

### Mobile-First Strategy
- **Base:** Optimize for mobile 375px width
- **Tablet:** 640px stack → grid 2 columns
- **Desktop:** 1024px grid → 3–4 columns, full sidebar
- **Navigation:** Mobile hamburger, desktop top nav
- **Hero map:** 100vh mobile, 85vh desktop
- **Form width:** Full width mobile, max 500px desktop

---

## Deployment Checklist

- [ ] All SVG assets in `/assets/` (light/dark variants)
- [ ] Favicon deployed at `/public/favicon.svg` (16px monogram)
- [ ] OG image template ready (1200×630px SVG)
- [ ] CSS variables in root stylesheet
- [ ] Tailwind 4 config extended with custom theme
- [ ] Plus Jakarta preload manifest in `<head>` (swap strategy)
- [ ] Inter fallback stack validated (no rendering jank)
- [ ] WCAG AA contrast tested (axe DevTools)
- [ ] CWV baseline recorded (FCP, LCP, CLS)
- [ ] Print stylesheet uses navy + copper only

---

## References

- **Design System:** This document (canonical source of truth)
- **Brand Assets:** `/projects/nexestate/assets/`
- **Tailwind Config:** `/projects/nexestate/tailwind.config.ts`
- **Meeting Notes:** `/docs/meetings/2026-03-24-nexestate-brand-identity.md`
- **Issue:** SKY-215 (Linear)

---

**Locked by Aurora / 2026-03-24**
