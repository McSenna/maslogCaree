# Design System & Implementation Guide

## 📋 Table of Contents
1. [Design Tokens](#design-tokens)
2. [Storybook Setup](#storybook-setup)
3. [Accessibility Testing](#accessibility-testing)
4. [Animations](#animations)

---

## Design Tokens

### Where colour comes from

`src/theme/palette.ts` holds the raw ramps (blue, teal, slate, and the status
hues). Everything else is built on it:

| Layer | File | Use it for |
| --- | --- | --- |
| Raw ramps | `src/theme/palette.ts` | Building a theme file. Components should not read ramps directly. |
| Semantic roles | `src/theme/colors.ts` via `useThemeColors()` | Surfaces, text tiers, primary, status tones, in both themes |
| Dashboard surfaces | `src/design/adminDashboard/{light,dark}Palette.ts` via `useAdminSurfacePalette()` | Admin and staff dashboards, tables and panels |
| Feature themes | e.g. `queueTheme.ts`, `notification.theme.ts`, `residentTheme.ts` | Feature-specific tints, built from the two layers above |
| Tailwind / CSS | `tailwind.config.js`, `global.css` | Class names and web-only rules. Values mirror `palette.ts`; keep them in sync. |

### Brand and text colours

| Role | Light | Dark | Notes |
| --- | --- | --- | --- |
| Primary | `blue[600]` #1565D8 | `blue[400]` #5A96F2 | White text on light primary is 5.4:1 |
| Secondary | `teal[700]` #0F766E | `teal[300]` #5FCBBE | White text on teal-700 is 5.5:1 |
| Heading | `ink` #0F2557 | `slate[50]` | |
| Body | `slate[700]` | `slate[300]` | |
| Muted | `slate[600]` #56657A | `slate[400]` | |
| Subtle | `slate[500]` #64748B | #7D8CA3 | The lightest grey allowed for text (AA 4.5:1) |
| Icons, borders, disabled | `slate[400]` #94A3B8 | `slate[500]` | Not for text: 2.6:1 on white |

Status colours are semantic and stay distinct: success green, warning amber,
danger red, info blue, in-progress violet, neutral slate. Role and service
colours (admin, doctor, prenatal, immunisation…) are categorical identifiers
used in charts and badges, not brand accents.

### Spacing, radius, type, shadow, motion

`src/theme` also exports `SPACING`, `RADII`, `TYPE`, `SHADOWS`, `BREAKPOINTS`
and the motion tokens described under [Animations](#animations).

### Usage

```tsx
const colors = useThemeColors();
<Text style={{ color: colors.muted }}>Last updated 2 min ago</Text>

const palette = useAdminSurfacePalette();
<View style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }} />
```

Do not add hex literals to components. If a colour is missing, add a role to
the theme file that owns that surface, built from `palette.ts`.

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
  - `ROLE_CONTENT_MAX_WIDTH` (1600) is the frame `RoleLayout` gives every signed-in page; after the sidebar it fills a 1920px screen.
  - `PAGE_MAX_WIDTH` caps pages that should not fill that frame: `reading` 760 → 960, `feed` 880 → 1280, `content` 1120 → 1400 (the larger value applies from the wide breakpoint). Read it with `usePageMaxWidth(kind)` instead of hard-coding a width.
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

### Dashboards (`src/components/dashboard/kit`)

Every role dashboard (admin, doctor, midwife, BHW, resident) is built from one kit, top to bottom:

1. `DashboardHeader`: greeting as the page `h1`, date plus one status line, refresh with "Updated … ago", one primary action and up to two secondary ones. Phones show the primary action full width; secondary actions only appear there with `showOnPhone`, because the bottom navigation already links to most of them.
2. `AttentionStrip`: count-first cards ("2 registrations to review") that link to the screen that resolves them. It renders nothing when the list is empty.
3. `MetricRow` + `MetricCard`: label on top, icon tile in the corner, value below, so values share a left edge. Tones carry meaning: amber for waiting, green for done. `progress` adds a thin bar for "seen of today's list".
4. Filters sit directly above what they change: `FilterChips` for named things (services), `SegmentedControl` for short exclusive sets (periods, table tabs, with optional counts). Both use radio semantics.
5. `SplitRow` pairs panels at a weight (2:1, 1.6:1) and stacks them below 900px of content width.
6. `DataTable`: sentence-case headers, numbers right-aligned, `minTableWidth` drops columns as the card narrows, and phones get `renderStacked` rows. Rows with `onRowPress` become buttons with a full spoken summary.

Charts draw in once on mount; later filter changes swap data without replaying the animation (`useMountProgress`). Dashboard shortcuts deep-link with query params: `/admin/users?section=requests`, `/admin/announcements?compose=1`, `/resident/appointments?book=1` (read with `useSearchParamValue`).
