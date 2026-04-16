import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ErrorState, LoadingState } from '@/components/feedback';
import { Button, Card, FormScreen, Input, TextArea } from '@/components/ui';
import { tokens } from '@/styles/tokens';

export default function PlaygroundFormScreen() {
  const [email, setEmail] = React.useState('');
  const [note, setNote] = React.useState('');
  const [bottomField, setBottomField] = React.useState('');
  const [submitState, setSubmitState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmitDemo = async () => {
    setSubmitState('loading');
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (email.trim().toLowerCase().includes('error')) {
      setSubmitState('error');
      return;
    }

    setSubmitState('success');
  };

  return (
    <FormScreen
      title="Keyboard-Safe Form Demo"
      subtitle="Focus lower inputs to validate keyboard handling, then run submit lifecycle states."
      footer={<Text style={styles.footer}>This route is internal playground-only.</Text>}>
      <Card>
        <Text style={styles.description}>
          This demo intentionally places multiple fields so keyboard handling and scroll behavior are easy to verify.
        </Text>
      </Card>

      <Card>
        <Input
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          value={email}
        />
        <TextArea
          label="Quick note"
          onChangeText={setNote}
          value={note}
        />
        <Input
          label="Bottom field"
          onChangeText={setBottomField}
          placeholder="Focus this field with keyboard open"
          value={bottomField}
        />

        {submitState === 'idle' ? <Text style={styles.note}>Submit to run loading/success/error states.</Text> : null}
        {submitState === 'loading' ? <LoadingState message="Submitting..." /> : null}
        {submitState === 'success' ? <Text style={styles.success}>Saved successfully.</Text> : null}
        {submitState === 'error' ? (
          <ErrorState
            title="Submit failed"
            message="Simulated async failure. Remove 'error' from email and retry."
            onRetry={() => void handleSubmitDemo()}
          />
        ) : null}

        <Button
          disabled={submitState === 'loading'}
          label="Run Async Submit Demo"
          loading={submitState === 'loading'}
          onPress={() => void handleSubmitDemo()}
        />
        <Button
          label="Reset Demo State"
          onPress={() => setSubmitState('idle')}
          variant="secondary"
        />
      </Card>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  description: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  footer: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  note: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  success: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.sizes.base,
    textAlign: 'center',
  },
});
