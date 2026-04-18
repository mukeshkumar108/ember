/**
 * Playground: Standard validated form demo
 *
 * Demonstrates Ember's standard form pattern:
 *   useForm + zodResolver → Controller → primitive + error prop
 *   Server errors via setError('root') → errors.root.message
 *   Submit disabled while loading, re-enabled on error
 */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, Checkbox, FormScreen, Input, Select, TextArea } from '@/components/ui';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

// ─── Schema ───────────────────────────────────────────────────────────────────
// Defined inline here because it's playground-only. Real app schemas live in src/lib/schemas.ts.

const demoSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  subscribe: z.boolean(),
});

type DemoFormData = z.infer<typeof demoSchema>;

const CATEGORY_OPTIONS = [
  { label: 'General', value: 'general' },
  { label: 'Bug report', value: 'bug' },
  { label: 'Feature request', value: 'feature' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PlaygroundFormScreen() {
  const { colors } = useTheme();
  const [submitState, setSubmitState] = React.useState<'idle' | 'success'>('idle');

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      email: '',
      message: '',
      category: '',
      subscribe: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    // Simulate async API call
    await new Promise<void>((resolve) => setTimeout(resolve, 900));

    // Simulate a server-side error when email contains 'error'
    if (data.email.includes('error')) {
      setError('root', { message: 'Server rejected this email address. Try a different one.' });
      return;
    }

    setSubmitState('success');
  });

  if (submitState === 'success') {
    return (
      <FormScreen
        title="Form Demo"
        subtitle="The standard Ember validated form pattern.">
        <Card>
          <Text style={[staticStyles.successTitle, { color: colors.foreground }]}>Submitted successfully</Text>
          <Text style={[staticStyles.successBody, { color: colors.foregroundSecondary }]}>
            Default values, field validation, server errors, and loading state all work.
          </Text>
          <Button
            label="Reset demo"
            variant="secondary"
            onPress={() => {
              reset();
              setSubmitState('idle');
            }}
          />
        </Card>
      </FormScreen>
    );
  }

  return (
    <FormScreen
      title="Form Demo"
      subtitle="Standard validated form: zod schema, field errors, server error, submit loading."
      footer={<Text style={[staticStyles.footer, { color: colors.muted }]}>Type &apos;error&apos; in the email field to trigger a server error.</Text>}>
      <Card>
        {/* Text input */}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              label="Email"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* TextArea */}
        <Controller
          control={control}
          name="message"
          render={({ field, fieldState }) => (
            <TextArea
              label="Message"
              placeholder="Minimum 10 characters…"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Select */}
        <Controller
          control={control}
          name="category"
          render={({ field, fieldState }) => (
            <Select
              label="Category"
              placeholder="Select a category"
              value={field.value}
              options={CATEGORY_OPTIONS}
              onValueChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Checkbox */}
        <Controller
          control={control}
          name="subscribe"
          render={({ field }) => (
            <Checkbox
              label="Subscribe to updates"
              description="Receive occasional product news."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* Server / root error */}
        {errors.root ? (
          <Text style={[staticStyles.serverError, { color: colors.danger }]} accessibilityRole="alert">
            {errors.root.message}
          </Text>
        ) : null}

        <Button
          label="Submit"
          loading={isSubmitting}
          onPress={() => void onSubmit()}
        />
      </Card>
    </FormScreen>
  );
}

const staticStyles = StyleSheet.create({
  serverError: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  successTitle: {
    fontFamily: tokens.typography.fonts.bold,
    fontSize: tokens.typography.sizes.lg,
    textAlign: 'center',
  },
  successBody: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
    lineHeight: tokens.typography.sizes.base * tokens.typography.lineHeights.normal,
    textAlign: 'center',
  },
  footer: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
});
