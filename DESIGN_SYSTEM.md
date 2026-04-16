# Ember Design System

Reference guide for customizing, extending, and building with the Ember UI system. Read this at the start of every new project forked from this template.

---

## 1. First Things to Change Per Project

When you fork Ember for a new product, these are the **only** token changes needed to re-skin the entire app:

```ts
// src/styles/tokens.ts — touch these first
colors: {
  primary: '#007AFF',      // ← your brand accent (buttons, links, focus rings, toggles)
  danger:  '#FF3B30',      // ← usually keep iOS red unless brand requires otherwise
  success: '#34C759',      // ← usually keep iOS green
}
```

Everything else — spacing, radius, typography, shadows — is already calibrated for iOS-feel and rarely needs changing early on.

> **Tip**: If your brand has a dark/charcoal primary (e.g. `#1A1A2E`), keep it as `primary` and add a separate `accent` token for interactive highlights. Update `button.tsx` and `input.tsx` to use `accent` for focus/active states.

---

## 2. Token Reference

All tokens live in `src/styles/tokens.ts` and are typed `as const`. Import them in every component:

```ts
import { tokens } from '@/styles/tokens';
```

### Colors

| Token | Value | Use for |
|---|---|---|
| `background` | `#FFFFFF` | Screen backgrounds, input fill |
| `backgroundSecondary` | `#F2F2F7` | Card fill, grouped list backgrounds |
| `foreground` | `#000000` | Primary text, headings |
| `foregroundSecondary` | `#636366` | Labels, metadata, secondary text |
| `muted` | `#8E8E93` | Placeholders, hints, disabled text, icons |
| `primary` | `#007AFF` | CTA buttons, focus rings, links, active states |
| `success` | `#34C759` | Confirmations, positive status |
| `warning` | `#FF9500` | Caution states |
| `danger` | `#FF3B30` | Errors, destructive actions |
| `border` | `#E5E5EA` | Input borders, separators, hairlines |
| `overlay` | `rgba(0,0,0,0.40)` | Modal/sheet backdrops |

**Never use raw hex values in components.** If you need a color that doesn't exist, add it to `tokens.ts` first.

### Spacing (4pt grid)

```
xs: 4   sm: 8   md: 12   lg: 16   xl: 24   2xl: 32   3xl: 48   4xl: 64
```

Use `lg` (16) for horizontal screen padding and between form fields. Use `xl` (24) for section gaps.

### Radius

```
sm: 8   md: 12   lg: 16   xl: 20   full: 9999
```

Use `md` for inputs and buttons. `lg` for cards and sheets. `full` for badges, avatars, and pill buttons.

### Typography

**Sizes:**
```
xs: 11   sm: 13   base: 16   lg: 20   xl: 24   2xl: 28   3xl: 34
```

**Weights:** `regular (400)` `medium (500)` `semibold (600)` `bold (700)`

**Line heights** — multiply by font size:
```ts
lineHeight: tokens.typography.sizes.base * tokens.typography.lineHeights.normal  // 16 × 1.5 = 24
```
| Multiplier | Value | Use for |
|---|---|---|
| `tight` | 1.2 | Headings, single-line labels |
| `normal` | 1.5 | Body text, form fields |
| `relaxed` | 1.75 | Descriptions, help text |

### Shadows

Apply with spread syntax directly onto your `style` array:

```ts
style={[styles.card, tokens.shadow.md]}
```

| Token | Use for |
|---|---|
| `shadow.sm` | Subtle lift (floating buttons, tooltips) |
| `shadow.md` | Cards, elevated surfaces |
| `shadow.lg` | Sheets, modals, popovers |

### Animation

```ts
tokens.animation.duration.fast   // 150ms  — micro-interactions
tokens.animation.duration.base   // 250ms  — standard transitions
tokens.animation.duration.slow   // 380ms  — large motion (sheet entry)

tokens.animation.spring   // { damping: 22, stiffness: 280, mass: 0.8 }
                          // spread into withSpring() for consistent spring feel
```

---

## 3. Icon System

**All icons use `lucide-react-native`.** Do not use `@expo/vector-icons` or `expo-symbols` in product UI.

```tsx
import { Bell, Settings, ChevronRight } from 'lucide-react-native';

// Direct use
<Settings size={20} color={tokens.colors.muted} strokeWidth={1.75} />

// Via wrapper (consistent defaults)
import { Icon } from '@/components/ui';
<Icon icon={Settings} size={20} color={tokens.colors.muted} />
```

**strokeWidth conventions:**
- `1.75` — default, body/secondary icons
- `2.0` — standard interactive icons
- `2.25` — active/selected state (e.g. active tab)

Browse all icons at [lucide.dev](https://lucide.dev).

---

## 4. Component API

### Screen layouts

```tsx
// Standard screen
<Screen header="Page Title" scroll keyboardAware>
  {/* content */}
</Screen>

// Props: header?, scroll?, keyboardAware?, style?, contentContainerStyle?
// Use keyboardAware whenever TextInputs are on screen

// Form/input-heavy screen
<FormScreen title="Sign In" subtitle="Optional subtitle" footer={<FooterNode />}>
  {/* inputs */}
</FormScreen>
```

### Grouping & structure

```tsx
<Section title="Account">        {/* small-caps iOS-style header */}
  <Card>...</Card>               {/* default: backgroundSecondary fill */}
  <Card variant="elevated">...</Card>   {/* white + shadow */}
  <Card variant="outlined">...</Card>   {/* border only */}
  <PressableCard onPress={fn}>...</PressableCard>
</Section>

<Divider />                      {/* hairline separator */}
<Divider label="or" />           {/* centered label divider */}
```

### Inputs

```tsx
<Input
  label="Email"
  placeholder="you@example.com"
  error="Invalid email"     // red border + message
  hint="We'll never share"  // muted helper text
  onChangeText={setEmail}
  value={email}
/>

<TextArea label="Bio" minHeight={120} ... />

<Select
  label="Country"
  options={[{ label: 'Australia', value: 'AU' }]}
  value={country}
  onValueChange={setCountry}
  // iOS: native ActionSheetIOS  |  Android: Sheet picker
/>

<Checkbox label="Agree to terms" checked={agreed} onChange={setAgreed} />
<Toggle label="Notifications" value={enabled} onValueChange={setEnabled} />
```

### Button

```tsx
<Button label="Save"    variant="primary"   />   // blue fill
<Button label="Cancel"  variant="secondary" />   // bordered
<Button label="Delete"  variant="danger"    />   // red fill
<Button label="View all" variant="ghost"   />   // text only

// Sizes: sm | md (default) | lg
// Props: loading?, disabled?
```

### Display components

```tsx
<Avatar name="Jane Doe" size="md" />            // sm | md | lg | xl
<Avatar name="Jane Doe" imageUri={uri} />       // with image

<Badge label="Active"   variant="success" />    // primary | success | warning | danger | neutral
<Badge label="3"        size="sm" />

<ListItem
  title="Notifications"
  subtitle="Push and email"
  leading={<Icon icon={Bell} size={20} color={tokens.colors.primary} />}
  trailing={<Badge label="3" variant="danger" size="sm" />}
  onPress={fn}
/>

<Skeleton shape="rect" width="100%" height={120} />
<Skeleton shape="circle" diameter={40} />
<Skeleton shape="text" width="60%" />
<SkeletonListItem />
```

### Overlays

```tsx
// Bottom sheet
<Sheet visible={isOpen} onClose={close} title="Options" footer={<Button ... />}>
  {/* content — footer is always visible, not inside scroll */}
</Sheet>

// Confirm dialog
<ConfirmModal
  visible={isOpen}
  title="Delete post?"
  message="This can't be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={handleDelete}
  onCancel={close}
/>

// Toast (use the hook anywhere inside AppProviders)
const { showToast } = useToast();
showToast({ message: 'Saved!', type: 'success' });
showToast({ message: 'Failed', type: 'error', durationMs: 5000 });
// types: info | success | warning | error
```

### Feedback states

```tsx
<LoadingState message="Fetching data…" fullScreen />
<ErrorState
  title="Couldn't load"
  message={error.message}
  onRetry={refetch}
  fullScreen
/>
<EmptyState
  icon={Inbox}           // Lucide icon
  title="No messages"
  description="Send one to get started."
/>
```

---

## 5. Common Screen Patterns

### Settings / list screen

```tsx
<Screen header="Settings" scroll>
  <Section title="Account">
    <Card variant="outlined" style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
      <ListItem title="Email" trailing={<Text>{email}</Text>} />
      <Divider />
      <ListItem title="Plan" trailing={<Badge label="Pro" variant="success" />} />
    </Card>
  </Section>

  <Section title="Danger Zone">
    <Card variant="outlined" style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
      <ListItem title="Delete Account" destructive onPress={handleDelete} />
    </Card>
  </Section>
</Screen>
```

### Form screen

```tsx
<FormScreen title="Edit Profile" subtitle="Changes are saved to your account.">
  <Card>
    <Input label="Display name" ... />
    <Input label="Email" ... />
    <TextArea label="Bio" ... />
    <Button label="Save" loading={isPending} onPress={handleSave} />
  </Card>
</FormScreen>
```

### Data list with loading/empty/error

```tsx
function MyListScreen() {
  const { data, isLoading, isError, error, refetch } = useMyData();

  if (isLoading) return <LoadingState fullScreen />;
  if (isError)   return <ErrorState fullScreen message={error.message} onRetry={refetch} />;
  if (!data?.length) return <EmptyState icon={Inbox} title="Nothing yet" />;

  return (
    <Screen scroll>
      {data.map((item) => (
        <ListItem key={item.id} title={item.name} onPress={() => router.push(`/item/${item.id}`)} />
      ))}
    </Screen>
  );
}
```

### Pull-to-refresh

```tsx
import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useRefreshControl } from '@/hooks';

function MyScreen() {
  const { data, refetch } = useMyData();
  const refreshProps = useRefreshControl(refetch);

  return (
    <ScrollView refreshControl={<RefreshControl {...refreshProps} />}>
      {/* content */}
    </ScrollView>
  );
}
```

---

## 6. Adding New Tokens

Only add to `tokens.ts` — never inline values.

```ts
// 1. Add to the right group in tokens.ts
colors: {
  // ...existing
  brand: '#FF6B35',        // project-specific accent
  brandSubtle: '#FFF0EA',  // tinted background for brand-colored elements
}

// 2. Use immediately in components
backgroundColor: tokens.colors.brandSubtle
```

For dark mode: the token system is structured so you can wrap the `tokens` object in a `useColorScheme` provider and swap the palette. The structure is ready; the dark palette just needs values.

---

## 7. Adding New Components

Follow these conventions:

1. **File**: `src/components/ui/my-component.tsx`
2. **Export**: named export, no default export
3. **Tokens**: all values from `tokens.ts`
4. **Props**: type as `MyComponentProps`, `StyleProp<ViewStyle>` for style overrides
5. **Export from index**: add to `src/components/ui/index.ts`
6. **Demo in playground**: add to `app/(protected)/(tabs)/playground.tsx`
7. **Document in AGENTS.md**: add row to the component catalogue table

Minimal template:

```tsx
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';

type MyComponentProps = {
  style?: StyleProp<ViewStyle>;
};

export function MyComponent({ style }: MyComponentProps) {
  return <View style={[styles.container, style]} />;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.backgroundSecondary,
    padding: tokens.spacing.lg,
  },
});
```

---

## 8. Animation Conventions

Use **Reanimated 4** for any animated component. Never use core `Animated` from React Native for new work.

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// Entry/exit patterns
withSpring(0, tokens.animation.spring)                          // snap to position
withTiming(1, { duration: tokens.animation.duration.fast })    // fade/opacity
withRepeat(withSequence(...), -1, false)                        // loop (skeleton shimmer)
```

For gestures (swipe, drag), use `react-native-gesture-handler`. If inside a Modal, wrap content in `<GestureHandlerRootView style={{ flex: 1 }}>`.

---

## 9. What's Intentionally Not Here

| Thing | Why |
|---|---|
| Dark mode palette | Token structure is ready. Add dark values when product requires it. |
| Custom fonts | Add `@expo-google-fonts/inter` + `useFonts()` in `_layout.tsx` when brand typography is decided. |
| Push notifications | `useDeviceRegistration` is the stub. Wire with `expo-notifications` when ready. |
| i18n / localization | Add `i18next` + `react-i18next` when product requires multiple languages. |
| Offline/network state | Add `@react-native-community/netinfo` + a banner component when offline UX is needed. |
| Analytics | Add as a side-effect in `_layout.tsx` or a provider. Never inside UI primitives. |
| Form validation library | `zod` is installed for API types. Add `react-hook-form` + `@hookform/resolvers` when form complexity warrants it. |
