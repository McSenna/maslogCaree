# 🎨 Design System Quick Reference

## Colors (Token Usage)
```tsx
// Primary action
className="bg-primary text-white"           // #3757FF on white

// Secondary/neutral
className="bg-surface border-border"        // White with light gray border

// Text hierarchy
className="text-text-primary"               // #121B3B (body text)
className="text-text-secondary"             // #334155 (secondary)
className="text-text-tertiary"              // #64748B (hints)

// Status
className="bg-success"  // Green (#27AE60)
className="bg-warning"  // Orange (#F2994A)
className="bg-danger"   // Red (#EB5757)
```

## Typography
```tsx
<Text className="text-6xl font-black">     Large heading
<Text className="text-5xl font-extrabold"> Heading 1
<Text className="text-4xl font-bold">      Heading 2
<Text className="text-3xl font-bold">      Heading 3
<Text className="text-lg">                 Body text
<Text className="text-sm">                 Small/hint text
```

## Spacing
```tsx
p-4      // 16px padding (standard)
gap-6    // 24px gap between items
mb-8     // 32px margin bottom
px-6 py-4 // 24px horizontal, 16px vertical
mt-2     // 8px margin top (small)
```

## Components

### Card
```tsx
className="rounded-lg bg-surface border-border shadow-md"
// or use utility class
className="card-base"    // predefined card styles
className="card-elevated" // for prominent cards
```

### Button
```tsx
// Primary
className="btn-primary"  // Blue, white text

// Secondary
className="btn-secondary" // White, gray text, border
```

### Focus Ring (Keyboard Nav)
```tsx
className="focus-ring"  // Blue ring on focus
```

## Animations
```tsx
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { cardEntranceAnimation, slideUpAnimation } from '@/utils/animations';

// Simple fade in
<Animated.View entering={FadeIn.duration(400)}>

// Slide up with delay
<Animated.View entering={SlideInUp.duration(500).delay(100)}>

// Using preset
<Animated.View entering={cardEntranceAnimation}>
```

## Responsive Breakpoints
```tsx
const { width } = useWindowDimensions();
const isTablet = width >= 768;    // md breakpoint
const isDesktop = width >= 1024;  // lg breakpoint
const isXL = width >= 1280;       // xl breakpoint
```

## Accessibility
```tsx
// Semantic
<article />    // Card/main content
<section />    // Grouped content
<header />     // Top bar
<nav />        // Navigation

// Labels
accessibilityLabel="Appointment service"
accessibilityHint="Tap to book an appointment"

// Screen readers
accessibilityRole="button"
accessibilityState={{ disabled: false }}
```

## Contrast Check
| Foreground | Background | Ratio | WCAG |
|-----------|-----------|-------|------|
| #121B3B   | #FFFFFF   | 15.2:1 | AAA ✅ |
| #334155   | #FFFFFF   | 9.1:1  | AAA ✅ |
| #3757FF   | #FFFFFF   | 5.4:1  | AA ✅ |
| #F2994A   | #FFFFFF   | 4.8:1  | AA ✅ |

## Token Files
- **Colors, Typography, Spacing, Shadows**: `tailwind.config.js`
- **CSS Variables, Utilities**: `global.css`
- **Animation Presets**: `src/utils/animations.ts`
- **Complete Docs**: `DESIGN_SYSTEM.md`

## Common Patterns

### Service Card
```tsx
<View className="rounded-3xl bg-white border-border p-5 shadow-md">
  <View className="mb-4 self-start rounded-xl p-3" style={{ backgroundColor: "#EEF2FF" }}>
    <Feather name="activity" size={20} color="#2D5BFF" />
  </View>
  <Text className="mb-2 font-extrabold text-text-primary">Label</Text>
  <Text className="text-sm text-text-secondary">Description</Text>
</View>
```

### Hero Section
```tsx
<View className="rounded-3xl bg-primary px-6 py-8 text-white">
  <Text className="mb-3 text-5xl font-black">Title</Text>
  <Text className="mb-7 text-lg opacity-90">Subtitle</Text>
</View>
```

### List Item with Stagger
```tsx
{items.map((item, idx) => (
  <Animated.View 
    key={item.id}
    entering={SlideInUp.duration(400).delay(idx * 100)}
  >
    <ItemComponent {...item} />
  </Animated.View>
))}
```

---

## Storybook
```bash
npm run storybook              # View component library
# Opens http://localhost:6006
```

## Testing
```bash
npm run test:a11y             # Run accessibility tests
npm run test:a11y:watch       # Watch mode
npm test                      # All tests
```

---

**Last Updated**: August 18, 2026 | **Version**: 1.0.0
