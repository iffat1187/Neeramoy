---
name: Neeramoy Clinical Trust
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4946'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7a77'
  outline-variant: '#bdc9c5'
  surface-tint: '#006b5f'
  primary: '#00675c'
  on-primary: '#ffffff'
  primary-container: '#0d8275'
  on-primary-container: '#edfffa'
  inverse-primary: '#77d7c8'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#815100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffaf9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#94f4e3'
  primary-fixed-dim: '#77d7c8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  price-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  price-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system establishes a high-trust, clinically rigorous e-pharmacy and digital wellness experience tailored for Bangladesh. The visual personality balances professional pharmacological authority with accessible warmth. The interface must inspire absolute confidence, sanitization, and reliability—countering counterfeit anxiety while remaining human, friction-free, and effortless for diverse age groups navigating prescriptions, chronic medication schedules, and urgent deliveries.

The aesthetic blends **Modern Clinical Minimalism** with **Tactile Utility**. Surfaces are pristine, crisp, and well-lit with generous whitespace, avoiding clinical coldness through soft mint undertones and warm amber urgency cues. Data-dense product cards (displaying strengths, generics, brands, regulatory badges, and BDT pricing) prioritize visual hierarchy, scanability, and bilingual typography harmony across English and Bengali script numerals and typography.

## Colors

The palette rejects standard retail vibrancy in favor of certified medical authority. 

- **Primary (`#0D8275`)**: Deep Clinical Teal. Used for primary calls-to-action, active bottom navigation, primary verification seals, and brand focal anchors. It conveys clinical precision, institutional credibility, and therapeutic calm.
- **Secondary (`#10B981`)**: Radiant Health Mint. Serves as the primary indicator of positive status: "OTC" (Over-The-Counter) classification badges, "In Stock" indicators, savings callouts, and completed prescription verifications.
- **Tertiary (`#F59E0B`)**: Warm Amber / Apothecary Ochre. Dedicated to medical alerts requiring consumer attention: "Prescription Required (Rx)", refill warnings, dosage notes, and critical expiry markers. A sharp clinical crimson (`#E11D48`) is reserved strictly for destructive actions, contraindications, and urgent medical notices.
- **Neutrals**: Rooted in an ultra-crisp slate spectrum. The canvas background rests on `#F8FAFC`, card surfaces on pure `#FFFFFF`, dividers on delicate `#E2E8F0`, secondary metadata text on `#475569`, and high-contrast headlines on deep slate `#0F172A`.

## Typography

Typography solves for strict pharmacological legibility, small-screen density, and dual-script (Bengali and Latin) harmony.

- **Plus Jakarta Sans** is employed for display, headers, and numeric price lockups. Its geometric curves soften technical medical terminology while preserving clean, forward-facing professionalism.
- **Inter** handles all clinical data, dosage indications, pharmaceutical composition labels, generic drug subtitles, and body text. Its neutral tall x-height guarantees zero ambiguity between similar drug names, milligram variations (e.g., 500mg vs. 50mg), and Latin/Bengali glyph pairing.
- **Special Numerics**: Price units use the Bengali Taka symbol `৳` paired directly with high-legibility tabular figures to eliminate horizontal jitter when values update in carts or checkout totals.

## Layout & Spacing

The layout follows a fluid-responsive column grid system tailored for rapid pharmaceutical discovery, prescription uploading, and dense catalog navigation:

- **Mobile (<768px)**: 4-column fluid layout with `1rem` margins and `1rem` gutters. Optimized for single-thumb checkout and prescription camera uploads. Product catalogs render as 2-column compact grids or stacked horizontal medicine cards.
- **Tablet (768px–1024px)**: 8-column layout with `1.5rem` margins and `1.25rem` gutters. Multi-item cart drawers and filter sheets expand into structured side panels.
- **Desktop (>1024px)**: 12-column layout capped at a maximum container width of `1280px` with `2.5rem` outer canvas margins and `1.5rem` gutters. Enables side-by-side generic substitution suggestions alongside the primary search results.

Vertical rhythm follows a strict 4px/8px incremental scale (`space-xs` to `space-2xl`), preserving consistent baseline alignment across English dosage text and Bengali subtitles.

## Elevation & Depth

Depth in this system conveys hygiene, safety, and spatial separation without relying on dark, heavy shadows. Visual hierarchy is established via **clean surface-tinted elevation**:

- **Level 0 (Flat)**: Background canvas (`#F8FAFC`) with no shadow. Structural dividers use a crisp 1px border (`#E2E8F0`).
- **Level 1 (Card & Grid Default)**: Surface `#FFFFFF` layered over `#F8FAFC`, bordered by a subtle 1px border (`#EDF2F7`), accompanied by an ultra-soft clinical ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Hover & Interactive)**: Active medicine cards and upload dropzones elevate slightly: `0 6px 16px -2px rgba(13, 130, 117, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)`. Note the subtle teal undertone tint in the ambient blur.
- **Level 3 (Sticky Action Bars & Modals)**: Bottom checkout drawers, prescription review modals, and floating customer support buttons utilize: `0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)`.

## Shapes

The shape vocabulary emphasizes rounded comfort (`roundedness: 2`), reflecting the physical geometry of tablets, capsules, and modern pharmacy packaging:

- **Base Inputs & Small Elements (`0.5rem` / `rounded-md`)**: Checkboxes, quantity steppers, and inline input fields.
- **Cards & Containers (`1rem` / `rounded-lg`)**: Product listing cards, prescription upload boxes, and order tracking timeline panels.
- **Hero & Dialog Surfaces (`1.5rem` / `rounded-xl`)**: Full-screen prescription preview modals, promotional category banners, and bottom sheets.
- **Pills (`9999px` / `rounded-full`)**: Preserved exclusively for status badges (Rx, OTC, Discount %), floating pill tags, verified pharmacy check seals, and primary action buttons.

## Components

### Buttons
- **Primary Clinical Action**: Background `#0D8275`, text `#FFFFFF`, font `label-lg`, radius `rounded-full` or `rounded-lg`. High-contrast focus state with a 3px ring (`#0D8275` at 30% opacity). Includes an integrated loading spinner for cart operations.
- **Secondary / Ghost**: Crisp 1.5px border `#0D8275`, transparent background, text `#0D8275`. On hover, fills with 5% teal tint.
- **Prescription Upload CTA**: Gradient background blending `#0D8275` to `#073B3A`, featuring a bold document-scan icon, white text, and an elevated shadow.

### Status & Regulatory Chips
- **Prescription Required (Rx)**: Amber/Rose tint badge (`#FEF3C7` background, `#92400E` text, `#FCD34D` 1px border) with an `Rx` medical emblem.
- **OTC (Over The Counter)**: Mint tint badge (`#ECFDF5` background, `#065F46` text, `#A7F3D0` 1px border) indicating unrestricted access.
- **Discount Chip**: Crisp coral badge (`#FFF1F2` background, `#BE123C` text) displaying savings percentage (e.g., `৳১২ ছাড়` or `12% OFF`).

### Medicine Product Cards
- Encased in `rounded-lg` with surface `#FFFFFF` and 1px border `#E2E8F0`.
- Top row: Rx/OTC badge paired with Verified Genuine seal (emerald tick).
- Middle row: Brand name in `headline-sm`, subtitle containing Generic Chemical Name + Formulation (e.g., *Paracetamol 500mg Tablet*) in `body-sm` (`#475569`), followed by pharmaceutical manufacturer name.
- Bottom row: Current price in `price-md` with `৳` symbol, struck-through original price in `#94A3B8`, and a quick "+ Add" pill button.

### Form Inputs & Prescription Dropzones
- **Inputs**: 44px minimum touch target, `#F8FAFC` idle background shifting to `#FFFFFF` on focus, bounded by a 1px `#CBD5E1` border that transitions to 2px solid `#0D8275`.
- **Prescription Dropzone**: Dashed border (`2px dashed #0D8275`), surface `#F0FDFA`, featuring instant camera capture triggers for mobile web users and encrypted privacy assurance tags.

### Checkboxes & Radios
- 20px squares/circles with `rounded-md` corners, border 2px `#94A3B8`. When checked, surfaces fill with `#0D8275` housing a crisp white geometric checkmark. Focus states maintain an accessible 2px offset ring.