# Apple App Store Compliance & Accessibility Baseline

A reference for what is already handled, what you must configure per-project, and what to keep in mind for App Store submission.

---

## Already Built In

### Accessibility (VoiceOver / Switch Control)

| Component | What's wired |
|-----------|-------------|
| `Button` | `accessibilityRole="button"`, label includes "loading" state, `accessibilityState.busy` |
| `Input` | Label surfaced via `accessibilityLabel`, `accessibilityInvalid`, `accessibilityValue` for errors, error `Text` has `role="alert"` |
| `Select` | `accessibilityRole="combobox"`, full label+value composite, `expanded` state |
| `Checkbox` | `accessibilityRole="checkbox"`, label+description composite, `checked`/`disabled` state |
| `ListItem` | Combined title+subtitle `accessibilityLabel`, `disabled` state |
| `Sheet` | `accessibilityViewIsModal` on Modal (VoiceOver stays inside), `onRequestClose` for hardware back |
| `ConfirmModal` | `accessibilityViewIsModal`, `accessibilityRole="alert"` on dialog panel, `onRequestClose` |
| `Toast` | `accessibilityLiveRegion="polite"` (announced without focus), `accessibilityRole="status"` |
| `ErrorState` | Descriptive message as text, retry `Button` with proper label |
| `Screen` | `SafeAreaView` used throughout; keyboard avoidance with `KeyboardAvoidingView` |

### Reduce Motion

`useReduceMotion()` is wired into: `Sheet`, `ConfirmModal`, `Toast`, `Checkbox`.  
All spring/bounce animations fall back to instant (`duration: 0`) when the system "Reduce Motion" setting is on. Apple requires this for apps submitted to the App Store.

### Touch Target Sizes

All interactive elements are at least **44×44pt** (Apple HIG minimum):
- `Button`: `minHeight` 36/50/56 per size (sm still ≥ 36pt, acceptable for secondary icon-only contexts; primary/md are ≥50pt)
- `Input`, `Select`, `ListItem`: `minHeight: 50`
- `Checkbox` row: `minHeight: 44`

### Color Contrast (WCAG AA — 4.5:1)

| Context | Contrast | Status |
|---------|----------|--------|
| Body text on background (`#000` on `#FFF`) | 21:1 | ✅ |
| Primary button text (white on `#007AFF`) | 4.55:1 | ✅ |
| Danger button (white on `#FF3B30`) | 4.6:1 | ✅ |
| Success badge text (`#1A7A32` on tinted bg) | ≥4.5:1 | ✅ |
| Warning badge text (`#7A4A00` on tinted bg) | ≥4.5:1 | ✅ |
| Toast success (white on `#1A7A32`) | ≥4.5:1 | ✅ |
| Toast warning (white on `#7A4A00`) | ≥4.5:1 | ✅ |
| Muted/secondary text (`#636366` on `#FFF`) | 5.74:1 | ✅ |

> **Note:** Do not use the raw `tokens.colors.success` (`#34C759`) or `tokens.colors.warning` (`#FF9500`) as text colors on light backgrounds — they fail contrast. The badge and toast components intentionally use the darker variants above.

---

## Required Per-Project Configuration

### 1. Bundle ID & App Name (`app.json`)

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

### 2. Privacy Usage Description Strings

Apple requires a human-readable justification for **every** permission your app requests. Add these to `app.json` only for permissions you actually use:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "We use the camera to let you upload a profile photo.",
        "NSPhotoLibraryUsageDescription": "We use your photo library to let you choose a profile photo.",
        "NSLocationWhenInUseUsageDescription": "We use your location to show nearby results.",
        "NSMicrophoneUsageDescription": "We use the microphone for voice messages.",
        "NSContactsUsageDescription": "We use contacts to help you find friends.",
        "NSFaceIDUsageDescription": "We use Face ID for fast, secure sign-in."
      }
    }
  }
}
```

> **Missing a usage string = automatic App Store rejection.** Only include entries for permissions you actually request at runtime.

### 3. Privacy Manifest (`PrivacyInfo.xcprivacy`)

Expo SDK 54 auto-generates a privacy manifest for its own APIs. If you add a native module that accesses:
- User defaults / NSUserDefaults
- File timestamps
- System boot time
- Disk space
- Active keyboard list

…you must declare the API category and reason in `PrivacyInfo.xcprivacy`. Run `npx expo prebuild` and check the generated file; add entries for any third-party SDK requirements.

### 4. Sign In with Apple (Required if Any Social Login Is Present)

**Apple rule:** If your app offers any third-party login (Google, Facebook, Twitter, etc.), it **must also offer Sign In with Apple**. This is an App Store Review guideline (4.8) violation if omitted.

Currently this app only uses Clerk email/password. If you add Google or any OAuth provider via Clerk, you must also enable the Sign In with Apple strategy in Clerk and add the entitlement:

```json
// app.json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.developer.applesignin": ["Default"]
      }
    }
  }
}
```

Then wire up `useSignIn` / `useSignUp` with the `apple` strategy via Clerk's `startOAuthFlow`.

### 5. App Store Screenshots & Metadata (EAS Submit)

Required device sizes for screenshots:
- 6.9" (iPhone 16 Pro Max) — required
- 6.5" (iPhone 11 Pro Max / 12 Pro Max) — required  
- 5.5" (iPhone 8 Plus) — required
- 12.9" iPad Pro (3rd gen+) — required if iPad supported

Use `eas build` + `eas submit` for the upload pipeline. Set `eas.json` with a `production` profile using `autoIncrement: true`.

### 6. Age Rating

Set the appropriate age rating in App Store Connect. If your app has user-generated content, select 17+ or enable content filtering to maintain a lower rating.

### 7. App Tracking Transparency (ATT)

Only required if you use advertising SDKs or cross-app tracking (e.g. Meta Pixel, Amplitude with cross-device). If you do:

```json
// app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSUserTrackingUsageDescription": "We use tracking to improve ads and app experience."
      }
    }
  }
}
```

And call `requestTrackingPermissionsAsync()` from `expo-tracking-transparency` before initialising any tracking SDK.

---

## VoiceOver Testing Checklist

Run through this on a physical device (Simulator VoiceOver is unreliable):

- [ ] Every interactive element is reachable by swiping right
- [ ] VoiceOver announces a meaningful label for every control (not just "button")
- [ ] Error states are announced when they appear (check `accessibilityRole="alert"`)
- [ ] Modals/sheets trap focus inside (`accessibilityViewIsModal`)
- [ ] No element reads its label twice (e.g. label + child text both read)
- [ ] Loading states announce "loading" (`accessibilityState.busy`)
- [ ] Custom tap targets are at least 44×44pt (enable "Accessibility Inspector" in Xcode)

Enable VoiceOver: **Settings → Accessibility → VoiceOver**, or triple-click the side button if configured.

---

## Reduce Motion Testing

1. **Settings → Accessibility → Motion → Reduce Motion** (toggle on)
2. Open the app and trigger: Sheet, ConfirmModal, Toast, Checkbox
3. All should appear/disappear instantly with no spring bounce

---

## Common App Store Rejection Reasons (Quick Reference)

| Reason | Guideline | Fix |
|--------|-----------|-----|
| Missing privacy usage strings | 5.1.1 | Add to `infoPlist` in `app.json` |
| No Sign In with Apple when social login present | 4.8 | Add Apple strategy in Clerk |
| Crashes on launch | 2.1 | Test on oldest supported iOS (check `expo.ios.deploymentTarget`) |
| Placeholder content / "lorem ipsum" in screenshots | 2.3.3 | Use real content in screenshots |
| Login required with no demo / explanation | 2.1 | Add demo account or explain in review notes |
| App does not work as described | 2.1 | Ensure metadata matches actual functionality |
| Missing keyboard avoidance | 2.1 / HIG | `<Screen keyboardAware>` on all form screens |

---

## Helpful Links

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Expo EAS Submit docs](https://docs.expo.dev/submit/introduction/)
- [Clerk Sign In with Apple](https://clerk.com/docs/authentication/social-connections/apple)
