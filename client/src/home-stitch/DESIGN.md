---
name: Cradera Market System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2b4ede'
  primary: '#284bdc'
  on-primary: '#ffffff'
  primary-container: '#4767f6'
  on-primary-container: '#fffbff'
  inverse-primary: '#b9c3ff'
  secondary: '#00677f'
  on-secondary: '#ffffff'
  secondary-container: '#00ccf9'
  on-secondary-container: '#005266'
  tertiary: '#b51824'
  on-tertiary: '#ffffff'
  tertiary-container: '#d93539'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001258'
  on-primary-fixed-variant: '#0032c2'
  secondary-fixed: '#b7eaff'
  secondary-fixed-dim: '#4cd6ff'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e60'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930015'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Clash Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Clash Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Clash Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Clash Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The design system is engineered for the high-velocity world of Nigerian digital asset trading. It prioritizes **Transparency, Speed, and Reliability**. The aesthetic moves away from cold, sterile SaaS patterns toward a "Vibrant Fintech" style—blending high-energy primary colors with approachable, soft-edged geometry.

The target audience consists of mobile-first traders who value immediate feedback and clear transaction paths. The UI should feel substantial and premium, using elevation and distinct surface separation to build confidence during high-value exchanges. It is a **Corporate-Modern** hybrid that leans into the bold, expressive nature of contemporary West African consumer tech.

## Colors

The palette is anchored by **Vibrant Blue (#5170FF)**, a color chosen to evoke modern banking trust with a digital-native energy. 

- **Primary:** Used for main actions (CTAs), active states, and brand-critical indicators.
- **Surface / Subtle:** #F8FAFC is the foundational color for container backgrounds, distinguishing them from the pure white (#FFFFFF) page background to create depth without relying on heavy lines.
- **High-Contrast Text:** Deep slates and blacks ensure maximum readability against vibrant accents.
- **Success/Warning:** Semantic colors are saturated to ensure "Transaction Successful" or "Rate Update" alerts are impossible to miss.

## Typography

This design system utilizes a high-personality typographic pairing. 

**Clash Display** (Heading) provides a bold, authoritative voice. Its wide apertures and geometric weight give the product a "premium" feel that sets it apart from generic system-font apps.

**Outfit** (Body & Labels) is used for all functional text. Its high x-height and rounded terminals complement the brand's soft shape language while maintaining exceptional legibility for financial figures and trade details. 

*Note: For all currency displays and exchange rates, use Outfit Medium or Semibold to ensure numbers are prominent.*

## Layout & Spacing

The layout follows a **Fluid Grid** model with a focus on mobile ergonomics. 

- **Mobile:** A 4-column grid with 20px outside margins. Most cards and inputs should span the full width to maximize touch targets.
- **Desktop:** A 12-column grid with a max-width of 1280px. 
- **Spacing Rhythm:** Based on a 4px baseline. Use 16px (md) for internal padding of cards and 24px (lg) for vertical section gaps.

The design should feel "airy" but dense with information where it matters (e.g., trade history or rate calculators), using whitespace to group related transactional elements.

## Elevation & Depth

To build trust, this design system uses **Ambient Shadows** and **Tonal Layers**.

1.  **Level 0 (Base):** Pure white background (#FFFFFF).
2.  **Level 1 (Containers):** #F8FAFC background with a 1px border (#E2E8F0) and no shadow. Used for secondary content blocks.
3.  **Level 2 (Cards):** #FFFFFF background with a soft, diffused shadow: `0px 4px 20px rgba(81, 112, 255, 0.08)`. The subtle blue tint in the shadow links the element back to the primary brand color.
4.  **Level 3 (Modals/Overlays):** A more pronounced shadow to indicate focus and separation from the background.

Avoid harsh black shadows; depth should feel like light passing through clean, modern surfaces.

## Shapes

The shape language is defined by **Roundness 16px (ROUND_SIXTEEN)**. This specific radius is applied to all primary cards, buttons, and input fields.

- **Primary Cards:** 16px corner radius.
- **Buttons & Inputs:** 12px to 16px depending on size, ensuring a consistent "squircle" feel.
- **Chips/Badges:** Fully pill-shaped (100px) to distinguish them from interactive buttons.

This soft geometry offsets the bold typography, making the marketplace feel approachable and user-friendly rather than strictly institutional.

## Components

### Buttons
Primary buttons use the #5170FF background with white text. They should have a subtle inner glow or shadow to feel "pressable." Secondary buttons use a light blue tint background (#EFF2FF) with primary blue text.

### Input Fields
Inputs are critical for a marketplace. They feature a 16px corner radius, #F8FAFC background, and a 1px border that turns Primary Blue on focus. Labels should be Outfit Semibold (14px) positioned above the field.

### Trade Cards
Cards are the primary vehicle for asset listing. They must feature a clear icon (e.g., Bitcoin or Giftcard icon), a bold Clash Display heading for the rate, and a "Trade Now" button that is immediately visible.

### Chips & Status
Status indicators (Pending, Completed, Cancelled) use high-saturation backgrounds with 10% opacity and 100% opacity text of the same color (e.g., Success Green).

### Navigation
The mobile navigation bar should be "floating" slightly above the bottom with a backdrop blur (Glassmorphism) to ensure it feels modern and always accessible.