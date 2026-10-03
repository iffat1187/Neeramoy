---
name: Neeramoy Digital Health
colors:
  surface: '#031427'
  surface-dim: '#031427'
  surface-bright: '#2a3a4f'
  surface-container-lowest: '#000f21'
  surface-container-low: '#0b1c30'
  surface-container: '#102034'
  surface-container-high: '#1b2b3f'
  surface-container-highest: '#26364a'
  on-surface: '#d3e4fe'
  on-surface-variant: '#bdc9c4'
  inverse-surface: '#d3e4fe'
  inverse-on-surface: '#213145'
  outline: '#87938e'
  outline-variant: '#3e4945'
  surface-tint: '#7ad7be'
  primary: '#7ad7be'
  on-primary: '#00382d'
  primary-container: '#007a65'
  on-primary-container: '#a6ffe6'
  inverse-primary: '#006b58'
  secondary: '#51dbc8'
  on-secondary: '#003731'
  secondary-container: '#00b19f'
  on-secondary-container: '#003d36'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#a85500'
  on-tertiary-container: '#ffeadd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#96f4da'
  primary-fixed-dim: '#7ad7be'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#005142'
  secondary-fixed: '#72f8e4'
  secondary-fixed-dim: '#51dbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#031427'
  on-background: '#d3e4fe'
  surface-variant: '#26364a'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  price-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a clinical yet deeply empathetic healthcare marketplace tailored for everyday consumers, patients managing chronic conditions, and caregivers. The aesthetic blends the exacting hygiene of medical standards with the welcoming accessibility of modern digital commerce, now optimized for a dark mode environment to reduce eye strain in low-light clinical settings. 

Visual principles prioritize uncompromised credibility, calm efficiency, and effortless legibility. The interface rejects unnecessary embellishments, instead employing generous optical breathing room, clear typographic hierarchy, and crisp structural dividers. Interactions should evoke reassurance, speed, and safety, eliminating anxiety during essential healthcare purchases.

## Colors

The palette balances clinical precision and restorative vitality within a dark mode framework. 

- **Primary (`#007A65`)**: Deep Medical Teal. Represents pharmaceutical precision, stability, and enduring trust. Used for core actions, primary buttons, active navigation states, and key identity anchors.
- **Secondary (`#0EB5A3`)**: Sky Teal. Provides freshness, optimism, and soft accents. Applied to secondary controls, subtle progress indicators, and interactive highlights.
- **Tertiary (`#E67E22`)**: Warm Amber. Drives urgency without inducing clinical panic. Reserved for promotional badges, discounts, pending states, and vital non-critical alerts.
- **Neutrals & Surfaces**: Backgrounds use deep slate dark surfaces, while active surfaces and item containers leverage elevated dark containers. Structural division relies on subtle dark-mode rules.
- **Typography Tokens**: High-contrast light text ensures optical clarity across dark lighting environments. Muted secondary information (generic names, manufacturer lines, dosage instructions) uses `#64748B`.
- **Specialized Badges**: Prescription requirements leverage clinical Indigo, verification guarantees utilize Emerald Green, and dosage warnings or stock outs trigger Red.

## Typography

The type scale combines **Plus Jakarta Sans** for welcoming, human-centric headlines and numeric impact, with **Inter** for utilitarian, highly legible clinical data.

All numeric values—particularly BDT prices (`৳`), tablet quantities, and volumetric measurements—must strictly employ tabular figures (`tnum`) to maintain vertical scanning stability across tables and multi-item checkout carts. Drug generic names must always be presented with clear typographic hierarchy: product brand name in bold weight (`body-md`), directly followed by generic chemical composition in italicized or lower-opacity medium weight (`body-sm`).

## Layout & Spacing

The layout is built upon an 8pt base grid with a fluid response model constrained to a maximum content width of 1280px on desktop platforms.

- **Mobile (< 768px)**: 4-column layout with `1rem` margins and `1rem` gutters. Optimized for thumb navigation, full-width checkout action bars, and 2-column product listing cards.
- **Tablet (768px – 1024px)**: 8-column layout with `2rem` margins and `1.5rem` gutters. Standardized 3-column product cards.
- **Desktop (> 1024px)**: 12-column layout with `3rem` margins and `2rem` gutters. Accommodates persistent contextual sidebars for prescription upload tracking, order summaries, and category filters.

Vertical spacing follows strict content grouping: internal card elements use `space-xs` (4px) to `space-sm` (8px), card container padding uses `space-md` (16px), and section boundaries use `space-xl` (40px).

## Elevation & Depth

This design system utilizes dark mode tonal surfaces, ambient occlusion, and subtle low-contrast borders to convey physical layer relationships and hierarchical depth.

- **Level 0 (Flat Canvas)**: Dark background base canvas for all list screens and dashboard pages.
- **Level 1 (Resting Card / Container)**: Dark surface container bounded by a subtle border.
- **Level 2 (Hover / Active Cards)**: Applied to interactive product cards upon hover with subtle glowing highlights.
- **Level 3 (Sticky Navigation / Drawers)**: Mobile sticky purchase bars, pharmacy bottom sheets, and sticky top headers.
- **Level 4 (Modal Overlays / Prescription Viewer)**: High-priority prescription zoom sheets and checkout dialogs.

## Shapes

The design system incorporates roundedness level `2`. This sets base elements to `0.5rem` (8px), larger surface elements to `1rem` (16px), and structural containers to `1.5rem` (24px). Fully rounded pills (`9999px`) are strictly reserved for compact status badges, dosage chips, and prescription verification tags.

This geometric curvature softens the clinical atmosphere while retaining technical precision, signaling approachable care and seamless digital execution.

## Components

### Buttons
- **Primary**: Solid Deep Medical Teal (`#007A65`), white text (`#FFFFFF`), `0.5rem` border radius, bold typography. Height: 48px for standard mobile tap targets; 40px for desktop.
- **Secondary**: Dark surface background, 1.5px outline in `#007A65`, text `#007A65`. Active hover state introduces an ultra-subtle tint.
- **Tertiary / Ghost**: Transparent background, text `#007A65`, used for low-friction actions like "View Alternative Brands" or "Change Quantity".

### Product Cards
- **Structure**: Encased in dark surface cards with an `8px` corner radius and subtle borders.
- **Internal Stack**:
  1. Header strip: "Rx Required" badge paired with discount tag.
  2. Medicine thumbnail on a clean neutral-tinted frame.
  3. Product title, followed by generic name, and manufacturer name.
  4. Footer row: Price in `price-lg` with `৳` symbol alongside original struck-through price, paired with an inline compact "Add" button or incremental quantity stepper.

### Form Inputs & Search
- Medicine search bars utilize elevated search input fields with leading icon search slots and clear "Upload Prescription" quick actions pinned to the trailing edge.
- Focus rings use 2px `#007A65` highlights with an offset outline. Helper labels clearly state generic matches as consumers type.

### Trust Badges & Status Chips
- **Authenticity Verified**: Pill shape with shield check icon.
- **Prescription Tag**: Violet outline or pill chip signaling required medical verification before dispatch.
- **Dosage Form Chips**: Compact pill tags displaying dosage details.

### Bottom Navigation & Sticky Purchase Tray (Mobile)
- Persistent bottom navigation with 4 primary destinations: Home, Categories, Upload Rx, and My Orders.
- On Product Details Pages (PDP), navigation seamlessly converts into an instant buy bar containing cart total, free delivery threshold indicator, and a full-width "Add to Bag" primary button.