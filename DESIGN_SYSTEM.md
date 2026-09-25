# Design System & Implementation Guide

## 📋 Table of Contents
1. [Design Tokens](#design-tokens)
2. [Storybook Setup](#storybook-setup)
3. [Accessibility Testing](#accessibility-testing)
4. [Animations](#animations)

---

## Design Tokens

### Location
- **Tailwind config**: `tailwind.config.js` - Extended theme configuration
- **CSS variables**: `global.css` - CSS custom properties and utility classes

### Token Categories

#### Colors
```javascript
// Primary brand
--color-primary: #3757FF
--color-primary-soft: #E7EFFF
--color-secondary: #1C9A7F

// Status
--color-success: #27AE60
--color-warning: #F2994A
--color-danger: #EB5757

// Surface & backgrounds
--color-surface: #FFFFFF
--color-elevated: #F8FAFC
--color-background: #F0F4F8
--color-border: #E2E8F0

// Text
--color-text-primary: #121B3B (90+ contrast)
--color-text-secondary: #334155
--color-text-tertiary: #64748B
--color-text-disabled: #94A3B8
```

#### Typography Scale
- **xs**: 11px / 1.4 line-height
- **sm**: 12px / 1.5 line-height
- **base**: 14px / 1.5 line-height
- **lg**: 16px / 1.6 line-height
- **xl**: 18px / 1.6 line-height
- **2xl**: 20px / 1.6 line-height
- **3xl**: 24px / 1.5 line-height
- **4xl**: 28px / 1.4 line-height
- **5xl**: 32px / 1.4 line-height
- **6xl**: 36px / 1.4 line-height

#### Spacing Scale (4px base unit)
```
1: 4px      5: 20px     9: 36px
2: 8px      6: 24px     10: 40px
3: 12px     7: 28px     11: 44px
4: 16px     8: 32px     12: 48px
```

#### Border Radius
```
xs: 4px     md: 12px    2xl: 24px
sm: 8px     lg: 16px    3xl: 32px
            xl: 20px    full: 9999px
```

#### Shadows (Elevation)
```
xs:  0 1px 2px rgba(15, 23, 42, 0.04)
sm:  0 1px 3px rgba(15, 23, 42, 0.06)
base: 0 1px 3px + 0 1px 2px (double shadow)
md:  0 4px 6px -1px + 0 2px 4px -1px
lg:  0 10px 15px -3px + 0 4px 6px -2px
xl:  0 20px 25px -5px + 0 10px 10px -5px
2xl: 0 25px 50px -12px
```

### Usage Examples

#### In Tailwind classes
```tsx
// Colors
<View className="bg-primary text-text-primary border-border" />

// Typography
<Text className="text-5xl font-black">Heading</Text>
<Text className="text-lg leading-relaxed">Body text</Text>

// Spacing
<View className="p-4 gap-6 mb-8">...</View>

// Border radius
<View className="rounded-lg" />

// Shadows
<View className="shadow-md" />
```

#### In CSS variables
```css
.card {
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

#### In inline styles
```tsx
style={{
  backgroundColor: "#3757FF",      // Use token color
  padding: 16,                      // Use spacing token
  borderRadius: 16,                 // Use radius token
  shadowColor: "#0F172A",
  shadowOpacity: 0.1,               // Use shadow opacity
}}
```

---

## Storybook Setup

### Installation (Ready to run)
```bash
cd maslogCare
npm install --save-dev @storybook/react-native
npx storybook init --type react_native
```

### Run Storybook
```bash
npm run storybook
```

### Story Files Created
- `src/components/home/HeroCard.stories.tsx`
- `src/components/home/ServiceCard.stories.tsx`

### Story Coverage

#### HeroCard Stories
1. **Default** - Mobile viewport
2. **Tablet** - Tablet-sized viewport with larger text
3. **Desktop** - Desktop viewport (iPad)
4. **HighContrast** - Accessibility testing
5. **FocusedState** - Keyboard navigation state

#### ServiceCard Stories
1. **Default** - Appointments variant
2. **Announcements** - Bell icon variant
3. **HealthServices** - Heart icon variant
4. **HealthRecords** - Shield icon variant
5. **Mobile** - Mobile viewport testing
6. **Tablet** - Tablet viewport testing
7. **AllServices** - Grid layout of all 4 cards
8. **Accessible** - WCAG AA compliance testing

### Using Storybook for QA
- **Visual regression**: Screenshot each story across viewports
- **Accessibility audit**: Use Storybook's a11y addon for axe scanning
- **Interaction testing**: Test responsive behavior at breakpoints

---

## Accessibility Testing

### Test Files Created
- `src/components/home/__tests__/HeroCard.a11y.test.tsx`
- `src/components/home/__tests__/ServiceCard.a11y.test.tsx`

### Setup Required
```bash
npm install --save-dev @testing-library/react-native jest-axe @types/jest
```

### Configure Jest (in package.json or jest.config.js)
```json
{
  "jest": {
    "preset": "react-native",
    "testEnvironment": "node",
    "setupFilesAfterEnv": ["<rootDir>/setup-jest.js"],
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts"
    ]
  }
}
```

### Test Categories

#### Color Contrast
- Validates WCAG AA (4.5:1 minimum for normal text, 3:1 for large text)
- Tests all text/background combinations

#### Semantic Structure
- Proper heading hierarchy
- Semantic HTML elements (`<article>`, `<section>`, etc.)
- Landmark identification

#### Touch Targets
- Minimum 44x44px (iOS) or 48dp (Android)
- Proper spacing between interactive elements

#### Labels & Descriptions
- All icons have `aria-label` or associated text
- Buttons have descriptive text
- Form inputs have associated labels

### Run Tests
```bash
npm test -- --testPathPattern="a11y"
```

### Coverage Metrics
Target: **90%+ component coverage** with accessibility tests
- All interactive components tested
- All color combinations validated
- Keyboard navigation verified

---

## Animations

MaslogCare's motion is crisp and calm. It exists to confirm an action, show that a state changed, or keep spatial continuity. Nothing loops except loading indicators and the landing hero.

### Tokens (`src/theme/motion.ts`)

| Token | Value | Use |
| --- | --- | --- |
| `EASING.out` | `bezier(0.23, 1, 0.32, 1)` | Default for entering, exiting, press and hover |
| `EASING.inOut` | `bezier(0.77, 0, 0.175, 1)` | Something moving while on screen, such as a toggle knob |
| `EASING.drawer` | `bezier(0.32, 0.72, 0, 1)` | Bottom sheets, in both directions |
| `TIMING.pressIn` / `pressOut` | 100 / 200 ms | Press feedback: fast down, slower settle |
| `TIMING.hover` | 160 ms | Web hover color and border changes (`webTransition(...)`) |
| `TIMING.enter` / `exit` | 240 / 180 ms | Cards, toasts, panels, list rows |
| `TIMING.modal` | 260 ms | Sheets and auth cards |
| `TIMING.page` | 220 ms | Page body fade (web) and tab cross-fade (native) |
| `PRESS_SCALE` | 0.98 | Buttons and cards. Icon buttons use 0.96 and the bell 0.94 |

### Rules

- Never use `ease-in` on UI, even for exits. Exits use `EASING.out` and are shorter than entrances.
- Keep UI motion under 300 ms. Only the landing page reveal (380 ms, 60 ms stagger) and chart draw-in run longer.
- Animate only `transform` and `opacity`. The one exception is the mission-schedule toggle track color.
- Nothing scales from 0. Entrances start at 0.94 to 0.98 scale or 6 to 12 px away.
- Dropdowns and the notification panel scale from their trigger (`transformOrigin: "top right"`). Centered modals scale from the center.
- Every animation checks `useReducedMotion()`. Under reduced motion, movement is dropped and short opacity changes remain.
- Web hover is color only, applied via `webTransition(...)`. RN Web never fires hover for touch, so phones don't get sticky hover states.
- Tab and keyboard actions stay fast: bottom-nav press is 0.96 with a 100 ms press-in, and tooltips wait 450 ms for hover intent but appear at once on keyboard focus.

### Shared pieces

- `useInteractionState()` handles press scale, hover and keyboard focus for any custom pressable.
- `FadeIn` is opacity plus a 6 px rise, used for one-off reveals.
- `AnimatedListItem` fades in rows with a 30 ms stagger capped at six rows, slides completed rows out to the left, and lets the remaining rows close the gap.
- `AppointmentStatusBadge` settles from 0.94 scale when a status changes.
- `useCountBump(count)` gives a notification badge a small scale settle when its count rises.
- `useSkeletonPulse(low, high)` is the single loading pulse used by every skeleton.

## Quality Checklist

- [ ] All colors meet WCAG AA contrast standards
- [ ] Spacing follows 4px grid system
- [ ] Typography uses defined scale
- [ ] Border radius consistent across components
- [ ] Shadows create proper elevation hierarchy
- [ ] Storybook stories cover all variants
- [ ] Accessibility tests pass (0 violations)
- [ ] Touch targets >= 44x44px
- [ ] Animations 60fps on mid-range devices
- [ ] Focus ring visible for keyboard navigation

---

## Resources

- Tailwind CSS Docs: https://tailwindcss.com/docs
- React Native Reanimated: https://docs.swmansion.com/react-native-reanimated/
- Storybook RN: https://storybook.js.org/docs/react-native/get-started/install
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- jest-axe: https://github.com/nickcolley/jest-axe

---

## Responsive system and shared components

Use these instead of writing per-screen versions.

### Tokens (`src/theme`)
- `breakpoints.ts`: mobile < 768, tablet 768–1023, desktop ≥ 1024, wide ≥ 1440. `CONTENT_MAX_WIDTH` (1440) and `PAGE_PADDING` (16 / 20 / 28 / 36).
- `colors.ts`: `getThemeColors(scheme)` returns semantic light/dark colors, including `success`, `warning`, `danger`, `info`, `progress` and `neutral` tones. Read them with `useThemeColors()`.
- `spacing.ts`, `radius.ts`, `typography.ts`, `shadows.ts`, `motion.ts` (`TIMING`, `PRESS_SCALE`).
- `webStyle.ts`: typed web-only CSS (cursor, transition, sticky, box-shadow). Never cast styles to `any`.

### Hooks
- `useResponsive()`: `isMobile`, `isTablet`, `isDesktop`, `isWideDesktop`, `isDesktopWeb`, `breakpoint`, `pagePadding`, `select({ mobile, tablet, desktop, wide })`. Do not compare `useWindowDimensions().width` against numbers in screens.
- `useDialogPresentation()`: `"sheet"` on phones, `"modal"` otherwise.
- `useInteractionState()`: press scale, hover and keyboard-focus state for custom pressables.

### Components
- Buttons (`components/buttons`): `Button` with `primary | secondary | danger | ghost | text`, `IconButton` (web tooltip), plus `PrimaryButton` and similar wrappers. All have hover, press, focus, disabled and loading states.
- Cards: `Card` (static, or interactive when given `onPress`) and `PressableShell` for turning an existing card into a link.
- Layout: `ResponsiveContainer` (max width) and `ResponsiveGrid` (measures its own width; `columnOptions` avoids orphan columns).
- Status: `AppointmentStatusBadge` with `audience="staff" | "resident"`. Labels and tones come from `appointmentStatusModel.ts`.
- Feedback: `EmptyState`, `ErrorState` (hides technical errors via `friendlyErrorMessage`), `FadeIn`, `AnimatedListItem`.
- Toasts: call `toast.success(title)` or `toast.error(title, detail)` from anywhere. One `ToastViewport` is mounted in `app/_layout.tsx`, and it sits above the mobile bottom navigation.
- Forms: `TextField` handles label, focus ring, hover, error below the field, success, disabled, and a password reveal toggle.
