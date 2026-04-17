# Form Patterns

Ember's standard approach to forms. Read this before building any form in an Ember-based app.

---

## The Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Form state | `react-hook-form` | Field values, touched/dirty state, submit handling |
| Validation | `zod` + `@hookform/resolvers/zod` | Schema-first validation with typed errors |
| UI | Ember primitives (`Input`, `TextArea`, `Select`, `Checkbox`, `Toggle`) | Rendering fields |
| Server errors | `setError('root', { message })` | Displaying API / Clerk errors inline |

`zod` is already in the repo as a dependency. `react-hook-form` and `@hookform/resolvers` are installed. No additional setup is needed.

---

## The Standard Pattern

Every Ember form looks like this:

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button } from '@/components/ui';

// 1. Define your schema
const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  name: z.string().min(1, 'Name is required'),
});
type FormData = z.infer<typeof schema>;

// 2. In the component
const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { email: '', name: '' },
});

const onSubmit = handleSubmit(async (data) => {
  try {
    await myApiCall(data);
  } catch (e) {
    // Server errors go on the root key — displayed as a summary below the fields
    setError('root', { message: e instanceof Error ? e.message : 'Something went wrong.' });
  }
});

// 3. Render fields with Controller
<Controller
  control={control}
  name="email"
  render={({ field, fieldState }) => (
    <Input
      label="Email"
      value={field.value}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  )}
/>

{/* 4. Show server error */}
{errors.root ? (
  <Text style={{ color: tokens.colors.danger }} accessibilityRole="alert">
    {errors.root.message}
  </Text>
) : null}

{/* 5. Submit button */}
<Button label="Submit" loading={isSubmitting} onPress={() => void onSubmit()} />
```

That's it. No custom wrappers. No form context. Just `useForm` → `Controller` → primitive.

---

## Controller Bindings by Primitive

Each Ember primitive maps cleanly to RHF's `Controller` render props:

### Input / TextArea
```tsx
<Controller
  control={control}
  name="fieldName"
  render={({ field, fieldState }) => (
    <Input
      label="Label"
      value={field.value}
      onChangeText={field.onChange}   // RHF uses onChange; Input uses onChangeText
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  )}
/>
```

### Select
```tsx
<Controller
  control={control}
  name="locale"
  render={({ field, fieldState }) => (
    <Select
      label="Locale"
      value={field.value}
      onValueChange={field.onChange}  // Select uses onValueChange
      options={LOCALE_OPTIONS}
      error={fieldState.error?.message}
    />
  )}
/>
```

### Checkbox
```tsx
<Controller
  control={control}
  name="agreed"
  render={({ field }) => (
    <Checkbox
      label="I agree to the terms"
      checked={field.value}           // Checkbox uses checked
      onChange={field.onChange}       // Checkbox uses onChange
    />
  )}
/>
```

### Toggle
```tsx
<Controller
  control={control}
  name="notifications"
  render={({ field }) => (
    <Toggle
      label="Push notifications"
      value={field.value}
      onValueChange={field.onChange}  // Toggle uses onValueChange
    />
  )}
/>
```

---

## Shared Schemas (`src/lib/schemas.ts`)

Ember-level schemas (auth, profile) live in `src/lib/schemas.ts`. Import and reuse them:

```ts
import { signInSchema, type SignInFormData } from '@/lib/schemas';
import { profileSchema, type ProfileFormData } from '@/lib/schemas';
```

**Add a schema here when** it is shared across two or more screens.

**Define it inline** (next to the screen component) when it is used in exactly one place.

---

## Where Form State Lives

**Rule:** the screen component owns `useForm`. The async action lives in a hook.

```
Screen (useForm, Controller, handleSubmit)
  └── Hook (async API call, returns submit fn + isSubmitting)
```

The hook accepts typed form data and either resolves or throws:

```ts
// In the hook — owns only the async side effect
async function submit(data: SignInFormData) {
  const result = await apiCall(data);
  // throws on error — screen catches with setError('root', ...)
}

// In the screen
const onSubmit = handleSubmit(async (data) => {
  try {
    await submit(data);
  } catch (e) {
    setError('root', { message: e instanceof Error ? e.message : 'Failed.' });
  }
});
```

This keeps validation separate from API concerns, and makes both independently testable.

---

## Handling Edit Forms (Pre-filled Values)

When editing an existing record (e.g. profile), initialize with `defaultValues` and call `reset` when data loads:

```tsx
const { reset, ...form } = useForm<ProfileFormData>({
  resolver: zodResolver(profileSchema),
  defaultValues: { displayName: '', bio: '' },
});

// Populate once server data arrives
React.useEffect(() => {
  if (user) reset(toFormDefaults(user));
}, [user, reset]);

// After a successful save, reset to new server values to clear isDirty
const onSave = form.handleSubmit(async (data) => {
  const updated = await saveProfile(data);
  reset(toFormDefaults(updated));
});

// Gate the Save button — disabled when nothing has changed
<Button
  label="Save"
  disabled={!form.formState.isDirty}
  loading={isSaving}
  onPress={() => void onSave()}
/>
```

---

## Multi-Step Forms

For multi-step flows (e.g. sign-up → verification), use one `useForm` instance per step. The hook holds the step state:

```tsx
// Hook owns step state (not form values)
const { isPendingVerification, startSignUp, verifyEmail, backToCredentials } = useEmailSignUp();

// Screen owns one form per step
const credentialsForm = useForm({ resolver: zodResolver(signUpSchema) });
const verificationForm = useForm({ resolver: zodResolver(verificationCodeSchema) });
```

This avoids sharing one complex form object across two different validation contexts.

---

## Validation Modes

The default (`mode: 'onSubmit'`) is correct for most cases: validate on submit, then re-validate on change after first submission. Do not change the mode unless you have a specific reason.

```ts
useForm({ resolver: zodResolver(schema) })           // ✅ default — validate on submit
useForm({ resolver: zodResolver(schema), mode: 'onChange' }) // ❌ avoid — too noisy on every keystroke
useForm({ resolver: zodResolver(schema), mode: 'onBlur' })   // acceptable for specific UX needs
```

---

## Server Errors

Server errors (from API calls, Clerk, etc.) go on the `root` key. Field-level server errors can be set on specific fields:

```ts
// Summary error under all fields
setError('root', { message: 'Invalid credentials.' });

// Specific field error from server
setError('email', { message: 'This email is already in use.' });
```

Display `errors.root.message` as a centered error text with `accessibilityRole="alert"` below the fields and above the submit button.

---

## Zod Schema Guidelines

```ts
// ✅ Clear error messages — explain what the user should do
z.string().min(1, 'Email is required').email('Enter a valid email address')
z.string().min(8, 'Password must be at least 8 characters')

// ✅ Cross-field validation with refine
z.object({ password: z.string(), confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],  // error appears on the confirm field
  });

// ✅ Optional fields — coerce empty strings to null before sending to API
z.string().max(500, 'Bio must be 500 characters or fewer')
// Then in the handler: data.bio.trim() || null

// ❌ Don't use .optional() on text fields that default to ''
// Empty string is a valid controlled value; use .trim() || null at the API boundary
```

---

## What NOT to Do

| Don't | Do instead |
|-------|-----------|
| Create `<ControlledInput>` or `<FormField>` wrappers | Use `Controller` directly — it's already minimal |
| Use `useState` for form field values | Use `useForm` — it handles all form state |
| Validate manually with `if (!email)` checks | Define a zod schema and let `zodResolver` run it |
| Put `useForm` inside a shared hook | The screen owns the form; hooks own async effects |
| Skip `defaultValues` | Always provide defaults — avoids uncontrolled→controlled warnings |
| Use `register()` instead of `Controller` | RN primitives need `Controller` — `register()` is for web |

---

## Practical Example: Adding a New Form

1. **Define the schema** — inline if one screen uses it, in `src/lib/schemas.ts` if shared:
   ```ts
   const mySchema = z.object({ name: z.string().min(1, 'Name is required') });
   type MyFormData = z.infer<typeof mySchema>;
   ```

2. **Set up the form:**
   ```tsx
   const { control, handleSubmit, setError, formState: { errors, isSubmitting } } =
     useForm<MyFormData>({ resolver: zodResolver(mySchema), defaultValues: { name: '' } });
   ```

3. **Render each field with `Controller`** — pass `field.value`, `field.onChange` (or `onChangeText`/`onValueChange`), `field.onBlur`, and `fieldState.error?.message`.

4. **Handle submit** — validate → run async action → `setError('root')` on failure.

5. **Show root error** as a `Text` with `accessibilityRole="alert"` between the last field and the submit button.

6. **Use `FormScreen`** as the screen wrapper for any input-heavy screen.

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/schemas.ts` | Shared zod schemas (auth, profile). Add new shared schemas here. |
| `src/hooks/auth/use-email-sign-in.ts` | Sign-in async action — accepts `SignInFormData`, throws on error |
| `src/hooks/auth/use-email-sign-up.ts` | Sign-up + verification async actions, owns step flow state |
| `src/components/auth/sign-in-screen.tsx` | Reference implementation — single form, field errors, root error |
| `src/components/auth/sign-up-screen.tsx` | Multi-step reference — two form instances, step transition |
| `src/components/account/settings-screen.tsx` | Edit form reference — `reset()` from server data, `isDirty` guard |
| `app/(protected)/(tabs)/playground-form.tsx` | Live demo: all form primitives, validation, server error, success |
