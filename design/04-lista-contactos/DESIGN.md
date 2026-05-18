---
name: Kindred
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece8'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#eae1dc'
  on-surface: '#1f1b18'
  on-surface-variant: '#56423c'
  inverse-surface: '#34302d'
  inverse-on-surface: '#f8efea'
  outline: '#8a726b'
  outline-variant: '#ddc0b9'
  surface-tint: '#9f4023'
  primary: '#9c3e21'
  on-primary: '#ffffff'
  primary-container: '#bc5636'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59f'
  secondary: '#5e5f5c'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dd'
  on-secondary-container: '#626361'
  tertiary: '#5d5c57'
  on-tertiary: '#ffffff'
  tertiary-container: '#767470'
  on-tertiary-container: '#fdffdd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb59f'
  on-primary-fixed: '#3a0a00'
  on-primary-fixed-variant: '#802a0d'
  secondary-fixed: '#e3e2df'
  secondary-fixed-dim: '#c7c6c4'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#464745'
  tertiary-fixed: '#e5e2dc'
  tertiary-fixed-dim: '#c9c6c1'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#474743'
  background: '#fff8f5'
  on-background: '#1f1b18'
  surface-variant: '#eae1dc'
typography:
  display-title:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  section-header:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  card-name:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-main:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  meta-data:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  button-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  section-gap: 48px
---

## Brand & Style

This design system is built around the concept of "Social Wellness." It treats personal relationship management not as a logistical chore, but as a mindful practice of connection. The aesthetic borrows heavily from modern wellness and meditation platforms, prioritizing emotional breathability and clarity over information density.

The style is **Soft Minimalism**. It rejects the cold, sterile nature of traditional productivity tools in favor of a warm, humanist interface. By eliminating shadows and relying on tonal layering and generous geometry, the interface feels grounded and honest. The emotional response should be one of calm, reliability, and warmth—reducing the anxiety often associated with "catching up" and replacing it with the joy of intentional outreach.

## Colors

The palette is anchored by **Warm Terracotta**, a primary color that evokes earthiness and human touch. It is used sparingly for high-impact actions and key branding moments to prevent visual fatigue.

The background strategy utilizes a "Layered White" approach. The base canvas is a crisp, clean white to ensure high legibility, while interactive containers and secondary information blocks use a subtle warm gray. This creates a soft distinction between the page and its contents without the need for harsh borders or shadows. Text is set in a deep charcoal-brown rather than pure black to maintain the warmth of the composition.

## Typography

This design system utilizes **Plus Jakarta Sans** (as the closest available match to Mulish’s humanist, rounded characteristics) to deliver a friendly and accessible reading experience. The type scale is intentionally generous, favoring large tap targets and clear hierarchies.

The "Display Title" is used for screen entry points and hero greetings. "Section Headers" organize the CRM's various relationship categories, while "Card Names" provide immediate recognition of contacts. The use of Medium and SemiBold weights ensures that even at smaller sizes (like Meta Data), the text remains highly legible against the warm gray backgrounds.

## Layout & Spacing

The layout follows a **Fluid Content** model with wide, comfortable margins. It avoids dense grids in favor of a centered, single-column focus on mobile and a balanced 12-column staggered layout on desktop.

Spacing is used to create "breathing room" between relationship nodes. Rather than cramming data, the system uses large vertical gaps (`section-gap`) to separate different life areas (e.g., Family vs. Professional). Components within cards use a tight 8px or 16px rhythm to maintain group cohesion, while the primary page containers use 24px-40px padding to ensure the UI never feels cramped or overwhelming.

## Elevation & Depth

This system avoids traditional box shadows and heavy elevation. Depth is communicated through **Tonal Layering** and **High-Contrast Contours**.

1.  **Level 0 (Base):** The #FFFFFF background.
2.  **Level 1 (Surface):** The #F5F4F1 cards. These provide a subtle container for information.
3.  **Level 2 (Interaction):** Elements that are being hovered or pressed may transition to a slightly darker warm gray (#EAE7E1) or gain a thin 1px stroke in the primary color.

By utilizing flat surfaces and distinct color shifts, the system remains "light" and airy, mirroring the effortless feeling of a well-maintained friendship.

## Shapes

The shape language is the defining characteristic of this design system. It is dominated by **Exaggerated Rounding**, which removes any perceived "sharpness" or clinical feel from the CRM.

Hero cards—used for primary reminders or "inner circle" contacts—utilize a massive 24px radius. Standard information cards use 20px. All buttons are strictly circular (pill-shaped) to reinforce the "wellness app" aesthetic. This consistent use of soft geometry makes the interface feel tactile and safe, encouraging frequent, low-stress interaction.

## Components

### Buttons
Buttons are 48px (standard) or 56px (hero) in height. They are always fully rounded. The Primary button uses the Warm Terracotta background with white text. Secondary buttons use a #F5F4F1 background with Terracotta text.

### Relationship Cards
The core unit of the system. Cards feature 20px corners and use the #F5F4F1 background. They should not have borders or shadows. Padding inside cards should be a generous 20px or 24px to keep information from touching the edges.

### Status Chips
Small, pill-shaped indicators for "Last Contact" or "Frequency." These should use a very soft tint of the primary color (10% opacity) with high-contrast text to remain accessible.

### Input Fields
Fields should be large (56px height) with a 16px border-radius. Use the #F5F4F1 background to distinguish them from the white canvas. On focus, the background remains, but a 2px Terracotta border is added.

### Connection Streaks (Progress)
Instead of hard-edged progress bars, use soft, thick lines with rounded caps to visualize "Relationship Health," keeping with the wellness theme.