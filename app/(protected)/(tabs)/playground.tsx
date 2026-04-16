import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Inbox, Layers } from 'lucide-react-native';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmModal,
  Divider,
  Icon,
  Input,
  ListItem,
  PressableCard,
  Screen,
  Section,
  Select,
  Sheet,
  Skeleton,
  SkeletonListItem,
  TextArea,
  Toggle,
  useToast,
} from '@/components/ui';
import { tokens } from '@/styles/tokens';

export default function PlaygroundScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [textInputValue, setTextInputValue] = React.useState('');
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const [selectValue, setSelectValue] = React.useState('');
  const [isChecked, setIsChecked] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [confirmResult, setConfirmResult] = React.useState('No confirm action run yet.');
  const [submitState, setSubmitState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleAsyncSubmit = async () => {
    setSubmitState('loading');
    await new Promise((resolve) => setTimeout(resolve, 900));
    if (textInputValue.trim().toLowerCase().includes('error')) {
      setSubmitState('error');
      return;
    }
    setSubmitState('success');
  };

  return (
    // keyboardAware + scroll so inputs push up when keyboard opens
    <Screen header="Playground" scroll keyboardAware>
      <Section title="About">
        <Text style={styles.note}>
          Internal validation surface for Ember UI primitives. All controls are interactive.
        </Text>
      </Section>

      <Section title="Buttons">
        <Button label="Primary" onPress={() => undefined} />
        <Button label="Secondary" onPress={() => undefined} variant="secondary" />
        <Button label="Danger" onPress={() => undefined} variant="danger" />
        <Button label="Ghost" onPress={() => undefined} variant="ghost" />
        <View style={styles.row}>
          <View style={styles.flex}>
            <Button label="Small" onPress={() => undefined} size="sm" />
          </View>
          <View style={styles.flex}>
            <Button label="Large" onPress={() => undefined} size="lg" />
          </View>
        </View>
        <Button label="Disabled" disabled onPress={() => undefined} variant="secondary" />
        <Button label="Loading…" loading onPress={() => undefined} />
      </Section>

      <Section title="Text Input">
        <Input
          label="Standard input"
          onChangeText={setTextInputValue}
          placeholder="Focus to see the blue border"
          value={textInputValue}
          hint="Tap to see focus state"
        />
        <Input
          error={textInputValue.length > 0 && textInputValue.length < 3 ? 'At least 3 characters required.' : undefined}
          label="With inline validation"
          onChangeText={setTextInputValue}
          placeholder="Type 1–2 chars to trigger error"
          value={textInputValue}
        />
      </Section>

      <Section title="TextArea">
        <TextArea
          label="Multi-line input"
          onChangeText={setTextAreaValue}
          placeholder="Write something longer here"
          value={textAreaValue}
        />
      </Section>

      <Section title="Select / Dropdown">
        <Select
          label="Locale"
          onValueChange={setSelectValue}
          options={[
            { label: 'System Default', value: '' },
            { label: 'English (US)', value: 'en-US' },
            { label: 'English (UK)', value: 'en-GB' },
            { label: 'Spanish', value: 'es-ES' },
          ]}
          placeholder="Pick a locale"
          value={selectValue}
          hint="Uses native ActionSheet on iOS"
        />
      </Section>

      <Section title="Checkbox">
        <Card>
          <Checkbox
            checked={isChecked}
            description="Animates on toggle. Haptics on iOS."
            label="Agree to demo terms"
            onChange={setIsChecked}
          />
        </Card>
      </Section>

      <Section title="Toggle / Switch">
        <Card>
          <Toggle
            description="Haptics on change."
            label="Enable notifications (demo)"
            onValueChange={setIsEnabled}
            value={isEnabled}
          />
        </Card>
      </Section>

      <Section title="Cards">
        <Card>
          <Text style={styles.cardTitle}>Default Card</Text>
          <Text style={styles.cardBody}>Uses backgroundSecondary fill. Good for grouped form fields.</Text>
        </Card>
        <Card variant="elevated">
          <Text style={styles.cardTitle}>Elevated Card</Text>
          <Text style={styles.cardBody}>White background with shadow — for content cards.</Text>
        </Card>
        <Card variant="outlined">
          <Text style={styles.cardTitle}>Outlined Card</Text>
          <Text style={styles.cardBody}>Border only — for subtle grouping.</Text>
        </Card>
        <PressableCard onPress={() => showToast({ message: 'Pressable card tapped.', type: 'info' })}>
          <Text style={styles.cardTitle}>Pressable Card</Text>
          <Text style={styles.cardBody}>Tap me — press state and haptics built in.</Text>
        </PressableCard>
      </Section>

      <Section title="Badge / Tag">
        <View style={styles.row}>
          <Badge label="Primary" variant="primary" />
          <Badge label="Success" variant="success" />
          <Badge label="Warning" variant="warning" />
          <Badge label="Danger" variant="danger" />
          <Badge label="Neutral" variant="neutral" />
        </View>
        <View style={styles.row}>
          <Badge label="Small" variant="primary" size="sm" />
          <Badge label="Medium" variant="primary" size="md" />
        </View>
      </Section>

      <Section title="Avatar">
        <View style={styles.row}>
          <Avatar name="Mukesh Kumar" size="sm" />
          <Avatar name="Jane Doe" size="md" />
          <Avatar name="John Smith" size="lg" />
          <Avatar name="Alice Brown" size="xl" />
        </View>
        <View style={styles.row}>
          <Avatar name="No Image" size="md" />
          <Avatar size="md" />
        </View>
      </Section>

      <Section title="Icon">
        <View style={styles.row}>
          <Icon icon={Layers} size={24} color={tokens.colors.foreground} />
          <Icon icon={Layers} size={24} color={tokens.colors.primary} />
          <Icon icon={Layers} size={24} color={tokens.colors.success} />
          <Icon icon={Layers} size={24} color={tokens.colors.danger} />
          <Icon icon={Layers} size={24} color={tokens.colors.muted} />
        </View>
      </Section>

      <Section title="Divider">
        <Divider />
        <Divider label="or" />
      </Section>

      <Section title="List Items">
        <Card variant="outlined" style={styles.listCard}>
          <ListItem
            title="Simple row"
            onPress={() => showToast({ message: 'Row tapped.', type: 'info' })}
          />
          <Divider />
          <ListItem
            title="With subtitle"
            subtitle="Secondary detail text"
            onPress={() => showToast({ message: 'Row tapped.', type: 'info' })}
          />
          <Divider />
          <ListItem
            title="With icon"
            subtitle="Leading slot"
            leading={<Icon icon={Layers} size={20} color={tokens.colors.primary} />}
            onPress={() => undefined}
          />
          <Divider />
          <ListItem
            title="With badge"
            trailing={<Badge label="New" variant="primary" size="sm" />}
          />
          <Divider />
          <ListItem
            title="Destructive action"
            destructive
            onPress={() => showToast({ message: 'Destructive tapped.', type: 'error' })}
          />
        </Card>
      </Section>

      <Section title="Skeleton / Loading Placeholders">
        <SkeletonListItem />
        <SkeletonListItem />
        <Skeleton width="80%" height={16} style={styles.skeletonGap} />
        <Skeleton width="60%" height={12} />
      </Section>

      <Section title="Feedback States">
        <View style={styles.stateDemo}>
          <LoadingState message="Loading state" />
        </View>
        <ErrorState message="Example error message." onRetry={() => undefined} />
        <EmptyState
          icon={Inbox}
          title="Nothing here yet"
          description="Empty state with an icon."
        />
      </Section>

      <Section title="Toast / Snackbar">
        <Button
          label="Info Toast"
          onPress={() => showToast({ message: 'Informational message.', type: 'info' })}
          variant="secondary"
        />
        <Button
          label="Success Toast"
          onPress={() => showToast({ message: 'Saved successfully.', type: 'success' })}
        />
        <Button
          label="Warning Toast"
          onPress={() => showToast({ message: 'Something may need attention.', type: 'warning' })}
          variant="secondary"
        />
        <Button
          label="Error Toast"
          onPress={() => showToast({ message: 'Request failed. Please retry.', type: 'error' })}
          variant="danger"
        />
      </Section>

      <Section title="Confirm Modal">
        <Text style={styles.note}>{confirmResult}</Text>
        <Button label="Open Confirm Modal" onPress={() => setIsConfirmOpen(true)} variant="secondary" />
      </Section>

      <Section title="Sheet">
        <Button label="Open Sheet" onPress={() => setIsSheetOpen(true)} />
      </Section>

      <Section title="Async Submit Lifecycle">
        <Text style={styles.note}>
          Include the word &ldquo;error&rdquo; in the text input above to simulate failure.
        </Text>
        {submitState === 'loading' ? <LoadingState message="Submitting…" /> : null}
        {submitState === 'error' ? (
          <ErrorState
            message="Simulated failure. Remove 'error' from input and retry."
            onRetry={() => void handleAsyncSubmit()}
          />
        ) : null}
        {submitState === 'success' ? <Text style={styles.success}>Submit succeeded.</Text> : null}
        <Button
          disabled={submitState === 'loading'}
          label="Run Async Submit"
          loading={submitState === 'loading'}
          onPress={() => void handleAsyncSubmit()}
        />
        <Button label="Reset" onPress={() => setSubmitState('idle')} variant="ghost" />
      </Section>

      <Section title="Keyboard Form Demo">
        <Text style={styles.note}>Dedicated route — focus lower fields to validate keyboard pushing inputs up.</Text>
        <Button
          label="Open Form Demo"
          onPress={() => router.push('/(protected)/(tabs)/playground-form')}
          variant="secondary"
        />
      </Section>

      {/* Overlays — rendered outside scroll sections */}
      <ConfirmModal
        confirmLabel="Delete"
        destructive
        message="This is the reusable confirm baseline for destructive actions."
        onCancel={() => {
          setIsConfirmOpen(false);
          setConfirmResult('Confirm cancelled.');
        }}
        onConfirm={() => {
          setIsConfirmOpen(false);
          setConfirmResult('Confirm accepted.');
        }}
        title="Delete Item?"
        visible={isConfirmOpen}
      />

      <Sheet
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Sheet Baseline"
        footer={<Button label="Close" onPress={() => setIsSheetOpen(false)} variant="secondary" />}>
        <Text style={styles.cardBody}>
          Slides up from off-screen with a spring. Swipe the handle down to dismiss.
          Backdrop tap also dismisses.
        </Text>
        <Badge label="Powered by Reanimated 4" variant="primary" />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  success: {
    color: tokens.colors.success,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.semibold,
    textAlign: 'center',
  },
  cardTitle: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.semibold,
  },
  cardBody: {
    color: tokens.colors.foregroundSecondary,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  stateDemo: {
    minHeight: 120,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  listCard: {
    padding: 0,
    overflow: 'hidden',
    gap: 0,
  },
  skeletonGap: {
    marginTop: tokens.spacing.sm,
  },
});
