# Neeramoy Design System & Visual Reference

This document outlines the visual language and design system extracted from the Stitch reference files. It serves as the single source of truth for the Neeramoy React frontend rebuilding process.

## 1. Colors & Color Roles
The application uses a custom tailored Tailwind palette based on Material Design 3 (M3) principles.

**Primary (Brand - Deep Teal):**
- `primary`: `#00675c` (Buttons, active states, key icons, important text)
- `on-primary`: `#ffffff` (Text on primary backgrounds)
- `primary-container`: `#0d8275` (Secondary action buttons, active navigation backgrounds)
- `on-primary-container`: `#edfffa`

**Secondary (Accent/Success - Emerald Green):**
- `secondary`: `#006c49` (Badges, express delivery icons, OTC indicators)
- `on-secondary`: `#ffffff`
- `secondary-container`: `#6cf8bb`
- `on-secondary-container`: `#00714d`

**Tertiary (Warm/Warning - Amber/Brown):**
- `tertiary`: `#815100` (Review stars, specific health categories)
- `on-tertiary`: `#ffffff`
- `tertiary-container`: `#a36700`

**Error (Danger - Red):**
- `error`: `#ba1a1a` (Discounts, out-of-stock, errors)
- `on-error`: `#ffffff`

**Surface & Backgrounds (Cool Tinted Whites/Blues):**
- `background`: `#faf8ff` (App background)
- `surface`: `#faf8ff` (General sections)
- `surface-container-lowest`: `#ffffff` (Card backgrounds, topmost layers)
- `surface-container-low`: `#f2f3ff` (Search bars, secondary card backgrounds)
- `surface-container`: `#eaedff` (Footers, inactive buttons, badge backgrounds)
- `surface-container-high`: `#e2e7ff` (Hover states for surface-container)

**Text & Outlines:**
- `on-surface`: `#131b2e` (Main headings and primary text)
- `on-surface-variant`: `#3e4946` (Subtitles, body text, secondary info)
- `outline`: `#6e7a77` (Borders, minor icons, disabled text)
- `outline-variant`: `#bdc9c5` (Dividers, input borders)

## 2. Typography & Font Hierarchy
Two main font families are used to create a clean, modern, and clinical hierarchy.

**Font Families:**
- Headings & Pricing: `Plus Jakarta Sans`
- Body & Labels: `Inter`

**Hierarchy:**
- `headline-xl`: 36px (lh: 44px), Bold 700 - Hero titles
- `headline-lg`: 28px (lh: 36px), Bold 700 - Section titles
- `headline-md`: 20px (lh: 28px), SemiBold 600 - Card titles, important sub-sections
- `headline-sm`: 16px (lh: 24px), SemiBold 600 - Small product titles
- `body-lg`: 16px (lh: 26px), Regular 400 - Intro paragraphs
- `body-md`: 14px (lh: 22px), Regular 400 - Main body text
- `body-sm`: 12px (lh: 18px), Regular 400 - Secondary text, descriptions
- `label-lg`: 14px (lh: 20px), SemiBold 600 - Button text, primary nav
- `label-md`: 12px (lh: 16px), SemiBold 600 - Small buttons, secondary nav
- `label-sm`: 11px (lh: 14px), Bold 700 - Badges, tiny tags (uppercase often used)
- `price-lg`: 22px (lh: 28px), Bold 700 - Main product price
- `price-md`: 16px (lh: 22px), Bold 700 - Card product price

## 3. Spacing System
Custom spacing tokens map to logical sizes for consistency.
- `space-xs`: `0.25rem` (4px)
- `space-sm`: `0.5rem` (8px)
- `space-md`: `1rem` (16px)
- `space-lg`: `1.5rem` (24px)
- `space-xl`: `2rem` (32px)
- `space-2xl`: `3rem` (48px)
- `margin-desktop`: `2.5rem` (40px) - Used for left/right container padding
- `gutter-desktop`: `1.5rem` (24px)

## 4. Border Radius & Shadows
- **Radii**: 
  - Standard buttons/inputs: `rounded-lg` (8px) or `rounded-xl` (12px)
  - Cards: `rounded-xl` (12px) or `rounded-2xl` (16px)
  - Badges/Icons: `rounded-full` (9999px)
- **Shadows**:
  - Cards & default elevation: `shadow-sm`
  - Card hover state: `shadow-md`
  - Sticky Headers: `shadow-[0_1px_8px_rgba(0,0,0,0.04)]`

## 5. UI Components & Patterns

**Buttons & Forms:**
- **Primary Button**: `bg-primary text-on-primary font-label-lg rounded-lg/xl`. Hover: `hover:bg-primary-container`.
- **Secondary/Action Button**: `bg-surface-container text-on-surface`. Hover: `hover:bg-surface-container-high`.
- **Inputs**: Wrapped in `bg-surface-container-low rounded-xl`. Focus state utilizes `focus-within:bg-surface-container-lowest focus-within:shadow-[0_2px_8px_rgba(0,103,92,0.12)]`.

**Cards (Products/Medicines):**
- **Container**: `bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow`.
- **Image**: Wrapped in a `w-20 h-20 rounded-lg bg-surface-container flex items-center justify-center` container.
- **Badges**: OTC, Rx, or Cold-Chain badges placed at the top (e.g., `bg-secondary-container/40 text-on-secondary-container rounded-md px-2 py-0.5 font-label-sm`).
- **Footer**: Price aligned left (`font-price-lg text-primary`), stock status right, Add to Cart full width or alongside a quantity selector (`- 1 +`).

**Header/Navbar:**
- **Container**: `fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]`.
- **Top Bar**: `bg-primary text-on-primary py-space-xs`.
- **Main Nav**: `h-20 max-w-7xl mx-auto px-margin-desktop`.
- **Category Nav (Bottom Bar)**: `bg-surface-container-low` with a horizontally scrolling list of categories (`overflow-x-auto`). Active item uses `bg-primary-container text-on-primary-container`.

**Footer:**
- `bg-surface-container text-on-surface-variant pt-space-2xl pb-space-xl mt-space-2xl`.

**Icons:**
- Uses Google `Material Symbols Outlined`.
- Common classes: `text-[16px]`, `text-[18px]`, `text-[20px]`, `text-[24px]`.
- Specific styles: `style={{ fontVariationSettings: "'FILL' 1" }}` used for filled states like active stars.

## 6. Responsive Behavior
- **Container**: Uses standard Tailwind `max-w-7xl mx-auto px-margin-desktop` (or standard `px-4`/`px-6` on smaller screens).
- **Grid Layouts**: Mobile `grid-cols-1`, Tablet `sm:grid-cols-2` or `md:grid-cols-3`, Desktop `lg:grid-cols-4` or `lg:grid-cols-12` (for hero split sections).
- **Navigation**: Horizontal scrolling (`overflow-x-auto whitespace-nowrap`) is used heavily on mobile for category menus to save space.
- Elements like side-by-side buttons stack on mobile (`flex-col sm:flex-row`).

## 7. Overall Visual Language
The design is **clinical, clean, and trustworthy**. It uses generous whitespace, subtle cool-tinted grays/blues for surfaces, and striking deep teal (`primary`) and emerald green (`secondary`) to highlight important actions and trust markers (like "100% Genuine" or "Cold-Chain Delivery"). The rounded corners and custom sans-serif typography create a friendly, accessible, yet professional healthcare e-commerce experience.
