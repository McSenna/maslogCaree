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

### Implementation Status
✅ **Installed**: `react-native-reanimated` (v4.x)

### Animation Utilities
Location: `src/utils/animations.ts`

#### Preset Animations
```typescript
// Card entrance (fade + spring)
cardEntranceAnimation        // 400ms, spring effect

// Slide up staggered
slideUpAnimation(delay)      // 500ms, customizable delay

// Pop in effect
popInAnimation               // 300ms, zoom + spring

// Bounce entrance
bounceInAnimation            // 600ms, playful

// Exit animations
fadeOutAnimation             // 300ms
slideDownExitAnimation       // 400ms
```

#### Animation Config
```typescript
ANIMATION_CONFIG = {
  FAST: 150,
  BASE: 300,
  SLOW: 500,
  
  STAGGER_SMALL: 50,
  STAGGER_MEDIUM: 100,
  STAGGER_LARGE: 200,
  
  SPRING: {
    mass: 1,
    damping: 10,
    stiffness: 100,
    overshootClamping: false,
  }
}
```

### Applied Animations

#### HeroCard
```tsx
// Outer card: Fade in + spring (500ms)
<Animated.View entering={FadeIn.duration(500).springify()}>
  
  // Content: Slide up with delay (600ms, 200ms delay)
  <Animated.View entering={SlideInUp.duration(600).delay(200)}>
    ...
  </Animated.View>
</Animated.View>
```

#### ServiceCard
```tsx
// Container: Fade in (400ms, 100ms delay)
<Animated.View entering={FadeIn.duration(400).delay(100)}>
  
  // Card content: Slide up (500ms, 150ms delay)
  <Animated.View entering={SlideInUp.duration(500).delay(150)}>
    ...
  </Animated.View>
</Animated.View>
```

### Best Practices

1. **Duration Guidelines**
   - Quick feedback: 150-250ms
   - Standard actions: 300-400ms
   - Entrance/exit: 400-600ms
   - Complex sequences: 600ms+

2. **Stagger Pattern**
   - List items: 50-100ms between each
   - Card grid: 100-150ms between cards
   - Sections: 200ms+ between major sections

3. **Spring Physics**
   - Use `.springify()` for bounce effect
   - Avoid over-animation (keep damping >= 10)
   - Test on real devices for performance

4. **Performance**
   - Use `enteringAnimation` instead of `style` transforms
   - Prefer native animations over JS-driven
   - Test on mid-range devices (Pixel 4, iPhone 11)
   - Monitor frame rate (target 60fps)

### Adding New Animations

#### Example: Animated Button
```tsx
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

<Animated.View entering={ZoomIn.duration(300)} exiting={ZoomOut.duration(300)}>
  <Button title="Click me" />
</Animated.View>
```

#### Example: Staggered List
```tsx
import { staggeredItemAnimation } from '@/utils/animations';

{items.map((item, idx) => (
  <Animated.View key={item.id} entering={staggeredItemAnimation(idx)}>
    <Item data={item} />
  </Animated.View>
))}
```

---

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
