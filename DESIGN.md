# PersonaFlow Hybrid — Design System

> Living document. Update this file whenever you change tokens, add components, or shift visual direction.

---

## 1. Visual Identity

**Theme name:** Warm Natural Light  
**Mood:** Calm, grounded, soft warmth — like a morning journaling session by a window.  
**Approach:** Glassmorphism cards floating over a full-screen nature landscape background. Clean white/transparent surfaces, orange brand accents, dark text for readability.

### Background

A fixed full-viewport landscape photo (autumn/mountain) is the persistent backdrop across **every page**.

```
Background image: /assets/legacy/vecteezy_vector-autumn-landscape-with-mountain-hills-views-landscape_3523105.jpg
Position: center center | Size: cover | Attachment: fixed (via z-index: -1)
```

The header sits **absolute/transparent** above it. Page content layers on top via glassmorphism cards and white section blocks.

---

## 2. Color Tokens

All tokens defined in `globals.css` (`:root`) and `brand-colors.css`.

### Brand Palette

| Token | Value | Usage |
|---|---|---|
| `--brand-primary` | `#f59e0b` | Amber — buttons, active states, highlights |
| `--brand-primary-hover` | `#d97706` | Button hover state |
| `--brand-accent` | `#b45309` | Deeper amber — secondary accents |
| `--brand-bg` | `#fef3e2` | Warm cream — section backgrounds |
| `--brand-text` | `#44403c` | Warm dark gray — body text on light bg |
| `--brand-gold` | `#f5c518` | Gold shimmer (IMDb-style ratings) |
| `--brand-orange` | `#f9d74a` | Soft yellow-orange — decorative |

### Semantic Color Tokens (globals.css)

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#f97316` | Orange — focus rings, inputs, CTAs |
| `--color-primary-dark` | `#ea580c` | Darker orange hover |
| `--color-primary-light` | `#fb923c` | Lighter orange variant |
| `--color-text-primary` | `#4a4a4a` | Main body text |
| `--color-text-secondary` | `#8b8b8b` | Muted / secondary text |
| `--color-text-light` | `#ffffff` | Text on dark/orange backgrounds |
| `--color-bg-glass` | `rgba(255,255,255,0.1)` | Glassmorphism card base |
| `--color-bg-glass-hover` | `rgba(255,255,255,0.15)` | Glass card on hover |
| `--color-border-glass` | `rgba(255,255,255,0.3)` | Glass card border |

### Hard-coded Overrides (page-specific, globals.css)

These are component-level color patches applied via `!important` due to legacy CSS conflicts. They should eventually be migrated to tokens.

| Selector | Color | Context |
|---|---|---|
| `.therapy-option-card-title` | `#f97316` | Therapy card headings |
| `.therapy-option-card-desc` | `#000000` | Therapy card body |
| `.journal-quick-tool-title` | `#f97316` | Journal tool headings |
| `.habit-category-filter.active` | `#f97316` | Active habit filter tab |
| `.habits-modal button` | `#000000` | Modal button text |

---

## 3. Typography

### Primary Font: Jost

Applied globally via `global-font.css` as `!important` override over Elementor/Astra defaults.

```css
font-family: 'Jost', sans-serif;
```

- Used for: ALL elements — headings, body, nav, labels, buttons
- Source: Google Fonts (loaded via `/assets/legacy/roboto.css` and Astra font stack)

### Secondary Font: Roboto

Used in card descriptions (JourneyCard, etc.).

```css
font-family: 'Roboto', sans-serif;
```

### System Fallback Stack

```css
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji"
```

### Type Scale (globals.css)

| Token | Value | Usage |
|---|---|---|
| `--font-size-xs` | `13px` | Labels, badges, helper text |
| `--font-size-sm` | `14px` | Card descriptions, secondary text |
| `--font-size-base` | `16px` | Body copy |
| `--font-size-lg` | `18px` | Section intros |
| `--font-size-xl` | `20px` | Sub-headings |
| `--font-size-2xl` | `24px` | Card titles, section headings |
| `--font-size-3xl` | `32px` | Page headings |
| `--font-size-4xl` | `42px` | Hero headline |

### Font Weights

- Regular: `400` — body copy
- Medium: `500` — sub-labels
- Semibold: `600` — card titles, nav links
- Bold: `700` — primary CTAs, modal headings

---

## 4. Spacing Scale

Defined in `globals.css`. Use tokens — never raw px values in new components.

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Buttons, inputs, tags |
| `--radius-md` | `12px` | Small cards |
| `--radius-lg` | `16px` | Standard cards |
| `--radius-xl` | `20px` | Journey cards, large panels |
| `--radius-full` | `9999px` | Pills, avatars, toggle buttons |

---

## 6. Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.1)` | Subtle lift |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.1)` | Cards at rest |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.1)` | Elevated elements |
| `--shadow-xl` | `0 24px 48px rgba(0,0,0,0.05)` | Modals, drawers |

Cards on hover use a bespoke value: `0 12px 40px rgba(0,0,0,0.12)`.

---

## 7. Animation & Motion

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `0.15s` | Micro-interactions (icon colour) |
| `--transition-normal` | `0.3s` | Standard UI transitions |
| `--transition-slow` | `0.5s` | Page-level animations |
| `--transition-ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Material-style easing (all transitions) |

### Standard Patterns

```css
/* Card hover lift */
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-8px);

/* Top-border reveal (JourneyCard) */
transform: scaleX(0) → scaleX(1) on hover, transform-origin: left;

/* Fade-in entry */
@keyframes fadeIn { from: opacity 0, translateY(10px) → to: opacity 1, translateY(0) }
animation: fadeIn 0.3s ease-out;
```

---

## 8. Glassmorphism Card System

The core visual pattern — used on JourneyCards, InfoCards, and feature panels.

```css
/* Base glass card */
background: rgba(255, 255, 255, 0.25);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.3);
border-radius: 20px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

/* Hover state */
background: rgba(255, 255, 255, 0.35);
border-color: rgba(255, 255, 255, 0.5);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
transform: translateY(-8px);
```

### Top Accent Bar (JourneyCard)

```css
/* Gradient bar that slides in on hover */
background: linear-gradient(90deg, rgba(255, 140, 0, 0.6), rgba(255, 94, 0, 0.6));
height: 4px; top: 0; left: 0; right: 0;
transform: scaleX(0) → scaleX(1); transform-origin: left;
```

---

## 9. Navigation (Header)

- Layout: Astra theme header — logo left, nav links right
- Style: **Transparent** (`background: transparent !important`) — floats over the background image via `position: absolute`
- z-index: `999`
- Logo: `/assets/images/logo.png` — 178 × 59px
- Nav links: Jost font, `#000000` default, orange on active (`current-menu-item`)
- Active route detection: Next.js `usePathname()` hook

### Routes

| Label | Path |
|---|---|
| Home | `/` |
| Therapy | `/therapy` |
| Journal | `/journal` |
| Habits | `/habits` |
| Flow AI | `/chat` |
| Settings | `/settings` (hidden in demo via `NEXT_PUBLIC_HIDE_SETTINGS=true`) |

---

## 10. Layout Principles

- **Max content width:** `1200px` (centered, `margin: 0 auto`)
- **Journey card grid:** `repeat(auto-fit, minmax(280px, 1fr))`, `gap: 30px`, max-width `1000px`
- **Section padding:** `px: 20px`, `py: 80px` for major sections
- **Mobile breakpoint:** `768px` — cards reduce padding (`30px 24px → 24px 20px`)
- **Header:** Absolute positioned, does not push page content down
- **Background:** Fixed via `position: fixed; z-index: -1` on a persistent `<div>` in `layout.tsx`

---

## 11. Page-Specific Style Files

All loaded globally in `app/layout.tsx`:

| File | Scope |
|---|---|
| `/assets/css/therapy.css` | Therapy page — option cards, chat UI |
| `/assets/css/journal.css` | Journal page — quick tools, entry cards |
| `/assets/css/habits.css` | Habits page — category filters, modals |
| `/assets/css/journey-cards.css` | Homepage journey card grid |
| `/assets/css/homepage-fix.css` | Hero layout, full-bleed sections, transparent header |
| `/assets/css/card-fixes.css` | Cross-page card colour/text overrides |
| `/assets/css/brand-colors.css` | Brand token definitions + utility classes |
| `/assets/css/global-font.css` | Jost font enforcement + colour resets |

---

## 12. Accessibility

- **Focus ring:** `2px solid var(--color-primary)` with `outline-offset: 2px` — visible on all keyboard-navigable elements
- **Button/link focus:** Additional `box-shadow: 0 0 0 4px rgba(249,115,22,0.1)`
- **Mouse users:** `:focus:not(:focus-visible)` removes outline to avoid clutter
- **Screen reader utility:** `.sr-only` class available globally
- **Skip link:** `.skip-to-main` jumps to `#main-content` on focus
- **ARIA:** Navigation landmark has `aria-label="Primary Site Navigation"`, active links use `aria-current="page"`

---

## 13. Component Inventory

| Component | File | Notes |
|---|---|---|
| `Header` | `components/Header.tsx` | Transparent nav, active link detection |
| `JourneyCard` | `components/JourneyCard.tsx` | Glassmorphism card with hover top-bar |
| `InfoCard` | `components/InfoCard.tsx` | Feature info card |
| `DemoBanner` | `components/DemoBanner.tsx` | Demo mode top banner |
| `ModeIndicator` | `components/ModeIndicator.tsx` | Demo/personal mode badge |
| `BodyClassUpdater` | `components/BodyClassUpdater.tsx` | Adds Astra page classes to `<body>` |
| `Toast` | `components/ui/Toast.tsx` | Global toast notifications (context-based) |
| Feature pages | `components/chat/`, `habits/`, `journal/`, `therapy/` | Page-level components |
| Shared | `components/shared/` | Shared sub-components |

---

## 14. Providers & Context

Defined in `app/layout.tsx`:

```tsx
<ToastProvider>
  <AppProvider>
    {children}
  </AppProvider>
</ToastProvider>
```

- `AppProvider` — global app state (mode: demo/personal, user config)
- `ToastProvider` — notification queue

---

## 15. Do's & Don'ts

### ✅ Do

- Use CSS tokens (`--space-4`, `--radius-lg`, etc.) — never hardcode raw px values
- Apply `backdrop-filter: blur(10px)` + `rgba` background for all new floating cards
- Match glassmorphism border: `1px solid rgba(255,255,255,0.3)`
- Use `cubic-bezier(0.4, 0, 0.2, 1)` for all transitions (Material easing)
- Add `focus-visible` styles to any new interactive element
- Keep new page-specific styles in `/assets/css/<page>.css` and link in `layout.tsx`

### ❌ Don't

- Don't add raw hex colors outside of `brand-colors.css` or `globals.css` tokens
- Don't use a white or solid background on the main page wrapper — the landscape BG must show through
- Don't add inline `style={}` for layout/colors — use CSS classes
- Don't use Tailwind utility classes directly (project uses vanilla CSS + legacy Astra utilities)
- Don't use `!important` in new code — it's legacy debt; new components should win via specificity
- Don't forget `-webkit-backdrop-filter` alongside `backdrop-filter` for Safari support
