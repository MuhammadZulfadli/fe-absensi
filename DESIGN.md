---
name: AttendSync Web
colors:
  surface: "#f8f9ff"
  surface-dim: "#ccdbf3"
  surface-bright: "#f8f9ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#eff4ff"
  surface-container: "#e6eeff"
  surface-container-high: "#dce9ff"
  surface-container-highest: "#d5e3fc"
  on-surface: "#0d1c2e"
  on-surface-variant: "#3d4947"
  inverse-surface: "#233144"
  inverse-on-surface: "#eaf1ff"
  outline: "#6d7a77"
  outline-variant: "#bcc9c6"
  surface-tint: "#006a61"
  primary: "#00685f"
  on-primary: "#ffffff"
  primary-container: "#008378"
  on-primary-container: "#f4fffc"
  inverse-primary: "#6bd8cb"
  secondary: "#4059aa"
  on-secondary: "#ffffff"
  secondary-container: "#8fa7fe"
  on-secondary-container: "#1d3989"
  tertiary: "#825100"
  on-tertiary: "#ffffff"
  tertiary-container: "#a36700"
  on-tertiary-container: "#fffbff"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#89f5e7"
  primary-fixed-dim: "#6bd8cb"
  on-primary-fixed: "#00201d"
  on-primary-fixed-variant: "#005049"
  secondary-fixed: "#dce1ff"
  secondary-fixed-dim: "#b6c4ff"
  on-secondary-fixed: "#00164e"
  on-secondary-fixed-variant: "#264191"
  tertiary-fixed: "#ffddb8"
  tertiary-fixed-dim: "#ffb95f"
  on-tertiary-fixed: "#2a1700"
  on-tertiary-fixed-variant: "#653e00"
  background: "#f8f9ff"
  on-background: "#0d1c2e"
  surface-variant: "#d5e3fc"
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  max-width: 1440px
---

## Brand & Style

The design system for this student attendance management platform is built on the principles of **Modern Educated Minimalism**. It aims to evoke a sense of reliability, precision, and ease of use for Teacher administrators and students alike.

The aesthetic is characterized by vast whitespace, high-contrast typography, and a "function-first" hierarchy. By stripping away unnecessary ornamentation, the design system focuses on data clarity and task efficiency. It utilizes subtle depth cues to separate navigational layers from content areas, ensuring that enterprise-level complexity feels approachable and organized.

**Key Attributes:**

- **Professional:** Trustworthy and stable, suitable for Teacher data.
- **Efficient:** Optimized for quick scanning of schedules and logs.
- **Sleek:** A refined, contemporary look that feels like modern SaaS rather than legacy enterprise software.

## Colors

The palette is designed for high legibility and professional distinction.

- **Primary (Professional Teal):** Used for primary actions, active states, and brand presence. It provides a fresh, modern alternative to traditional corporate blues.
- **Secondary (Deep Blue):** Reserved for global navigation and structural elements to provide a grounded, authoritative foundation.
- **Neutrals & Surface:** We use a multi-tiered gray scale. Slate (#475569) handles body text and icons, while Light Gray (#F3F4F6) defines borders and subtle backgrounds.
- **Status Colors:** Standard semantic colors apply: Emerald for "Present," Rose for "Absent," and Amber for "Late/Pending."

## Typography

This design system utilizes **Inter** for its exceptional readability in data-heavy environments. The typographic scale is optimized for information density without sacrificing clarity.

- **Headlines:** Use tighter letter spacing and semi-bold weights to create a strong visual anchor.
- **Body Text:** Standard body text is set at 16px to ensure accessibility across all demographics.
- **Data Labels:** Small, all-caps labels are used for table headers and metadata to distinguish them from interactive content.
- **Numerical Data:** Tabular figures (monospaced numbers) should be used within tables to ensure columns of figures align correctly.

## Layout & Spacing

The system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile devices.

- **Sidebar:** A fixed-width sidebar (260px) persists on desktop, collapsing into a hamburger menu on mobile.
- **Containers:** Content is housed in "Stage" containers with a maximum width of 1440px to prevent excessive line lengths on ultra-wide monitors.
- **Spacing Logic:** An 8px linear scale is used for all layout-level spacing, while a 4px scale is used for internal component density (e.g., button padding, icon spacing).
- **Table Density:** For data-heavy views, vertical cell padding is reduced to 12px (3 units) to maximize the "above the fold" information.

## Elevation & Depth

This design system uses a **Tonal Layering** approach combined with **Ambient Shadows** to create a structured hierarchy.

- **Level 0 (Background):** #F9FAFB. The canvas on which all elements sit.
- **Level 1 (Cards/Surfaces):** White (#FFFFFF) with a 1px border (#E5E7EB) and a very soft, diffused shadow (0px 1px 3px rgba(0,0,0,0.05)).
- **Level 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow (0px 10px 15px -3px rgba(0,0,0,0.1)) to draw immediate focus.
- **Interactions:** Hover states on interactive cards should subtly lift by increasing shadow depth and adding a primary-colored top border (2px).

## Shapes

The shape language is **Soft and Disciplined**. We avoid fully rounded "pill" shapes for primary buttons to maintain a professional, architectural feel.

- **Standard Elements:** Buttons, Input fields, and Small Cards use a 4px (0.25rem) radius.
- **Container Elements:** Large Dashboard Cards and Modals use an 8px (0.5rem) radius.
- **Status Indicators:** Small dots or subtle tags remain slightly rounded to feel approachable but never organic or bubbly.

## Components

### Buttons

Primary buttons use the Professional Teal background with white text. Secondary buttons use a Slate outline. Ghost buttons are reserved for secondary actions like "Cancel."

### Side Navigation

The sidebar uses the Deep Blue (#1E3A8A) background. Active states are indicated by a teal vertical bar on the left edge and a subtle background tint (white at 10% opacity).

### Data Tables

Tables are the core of this system. They feature:

- Sticky headers for long logs.
- Alternating row zebra-striping (Light Gray at 2% opacity).
- Inline "Status Chips" (e.g., "On Time" in a light green tint with dark green text).

### Input Fields

Inputs use a 1px Slate-200 border that transitions to Professional Teal on focus. Error states use a 1px Rose-500 border with a descriptive helper text below the field.

### Modern Cards

Cards are used to display high-level stats (e.g., "Total Hours," "Headcount"). They should feature a minimalist icon in the top right corner and a clear headline-sm value.
