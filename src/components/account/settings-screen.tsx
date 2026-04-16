import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { ErrorState, LoadingState } from '@/components/feedback';
import { Badge, Button, Card, Divider, FormScreen, Input, ListItem, Section, Select, TextArea, useToast } from '@/components/ui';
import { API_URL } from '@/config';
import { User } from '@/api/types';
import { useMe, useUpdateMe } from '@/hooks';
import { tokens } from '@/styles/tokens';

type ProfileFormState = {
  displayName: string;
  firstName: string;
  lastName: string;
  bio: string;
  locale: string;
  timezone: string;
};

const LOCALE_OPTIONS = [
  { label: 'System Default', value: '' },
  { label: 'English (US)', value: 'en-US' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'French', value: 'fr-FR' },
  { label: 'German', value: 'de-DE' },
];

const TIMEZONE_OPTIONS = [
  { label: 'System Default', value: '' },
  { label: 'UTC', value: 'UTC' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Europe/Berlin', value: 'Europe/Berlin' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'Asia/Kolkata', value: 'Asia/Kolkata' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
];

function withCurrentOption(
  options: { label: string; value: string }[],
  currentValue: string,
) {
  if (!currentValue || options.some((o) => o.value === currentValue)) {
    return options;
  }
  return [{ label: `Current (${currentValue})`, value: currentValue }, ...options];
}

function toFormState(user: User): ProfileFormState {
  return {
    displayName: user.profile.displayName ?? '',
    firstName: user.profile.firstName ?? '',
    lastName: user.profile.lastName ?? '',
    bio: user.profile.bio ?? '',
    locale: user.profile.locale ?? '',
    timezone: user.profile.timezone ?? '',
  };
}

function toNullableString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}


export function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { showToast } = useToast();
  const { data: user, error, isError, isLoading, refetch } = useMe();
  const updateMe = useUpdateMe();

  const [form, setForm] = React.useState<ProfileFormState | null>(null);

  React.useEffect(() => {
    if (user && !form) {
      setForm(toFormState(user));
    }
  }, [user, form]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(public)/sign-in');
    } catch {
      showToast({ message: 'Sign out failed. Please try again.', type: 'error' });
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This is a placeholder CTA only. Account deletion is deferred.',
      [{ text: 'OK' }],
    );
  };

  const handleSave = async () => {
    if (!form) {
      return;
    }
    try {
      const updated = await updateMe.mutateAsync({
        profile: {
          displayName: toNullableString(form.displayName),
          firstName: toNullableString(form.firstName),
          lastName: toNullableString(form.lastName),
          bio: toNullableString(form.bio),
          locale: toNullableString(form.locale),
          timezone: toNullableString(form.timezone),
        },
      });
      setForm(toFormState(updated));
      showToast({ message: 'Profile saved.', type: 'success' });
    } catch {
      showToast({ message: 'Could not save profile. Please retry.', type: 'error' });
    }
  };

  if (isLoading && !user) {
    return <LoadingState fullScreen message="Loading settings…" />;
  }

  if ((isError || !user) && error) {
    const message = error instanceof Error ? error.message : 'Unable to load account settings.';
    return <ErrorState fullScreen message={message} onRetry={() => void refetch()} />;
  }

  if (!user || !form) {
    return <LoadingState fullScreen message="Preparing settings…" />;
  }

  const localeOptions = withCurrentOption(LOCALE_OPTIONS, form.locale);
  const timezoneOptions = withCurrentOption(TIMEZONE_OPTIONS, form.timezone);

  return (
    <FormScreen
      title="Settings"
      subtitle="Your account and preferences."
      footer={<Text style={styles.footer}>Ember v1.0.0</Text>}>
      <Section title="Account">
        <Card variant="outlined" style={styles.listCard}>
          <ListItem
            title="Email"
            trailing={<Text style={styles.value}>{user.email ?? 'Unknown'}</Text>}
          />
          <Divider />
          <ListItem
            title="Subscription"
            trailing={
              <Badge
                label={user.subscription.plan}
                variant={user.subscription.status === 'active' ? 'success' : 'neutral'}
                size="sm"
              />
            }
          />
        </Card>
      </Section>

      <Section title="Profile">
        <Card>
          <Input
            label="Display name"
            onChangeText={(displayName) => setForm((prev) => (prev ? { ...prev, displayName } : prev))}
            value={form.displayName}
          />
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Input
                label="First name"
                onChangeText={(firstName) => setForm((prev) => (prev ? { ...prev, firstName } : prev))}
                value={form.firstName}
              />
            </View>
            <View style={styles.nameField}>
              <Input
                label="Last name"
                onChangeText={(lastName) => setForm((prev) => (prev ? { ...prev, lastName } : prev))}
                value={form.lastName}
              />
            </View>
          </View>
          <TextArea
            label="Bio"
            onChangeText={(bio) => setForm((prev) => (prev ? { ...prev, bio } : prev))}
            value={form.bio}
          />
          <Select
            label="Locale"
            onValueChange={(locale) => setForm((prev) => (prev ? { ...prev, locale } : prev))}
            options={localeOptions}
            placeholder="Select locale"
            value={form.locale}
          />
          <Select
            label="Timezone"
            onValueChange={(timezone) => setForm((prev) => (prev ? { ...prev, timezone } : prev))}
            options={timezoneOptions}
            placeholder="Select timezone"
            value={form.timezone}
          />
          <Button
            label="Save Profile"
            loading={updateMe.isPending}
            onPress={() => void handleSave()}
          />
        </Card>
      </Section>

      <Section title="Session">
        <Card variant="outlined" style={styles.listCard}>
          <ListItem
            title="Log Out"
            onPress={() => void handleSignOut()}
          />
          <Divider />
          <ListItem
            title="Delete Account"
            destructive
            onPress={handleDeleteAccount}
          />
        </Card>
      </Section>

      {__DEV__ ? (
        <Section title="Developer">
          <Card>
            <Text style={styles.meta}>API: {API_URL}</Text>
            <Text style={styles.meta}>User ID: {user.id}</Text>
            <Button label="Refetch /me" onPress={() => void refetch()} variant="secondary" size="sm" />
            <Button
              label="Open UI Playground"
              onPress={() => router.push('/(protected)/(tabs)/playground')}
              variant="ghost"
              size="sm"
            />
          </Card>
        </Section>
      ) : null}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  nameField: {
    flex: 1,
  },
  value: {
    color: tokens.colors.foregroundSecondary,
    fontSize: tokens.typography.sizes.sm,
  },
  listCard: {
    padding: 0,
    overflow: 'hidden',
    gap: 0,
  },
  meta: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
  },
  footer: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
});
