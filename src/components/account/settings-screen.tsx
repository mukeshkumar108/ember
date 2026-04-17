import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { ErrorState, LoadingState } from '@/components/feedback';
import { Badge, Button, Card, Divider, FormScreen, Input, ListItem, Section, Select, TextArea, useToast } from '@/components/ui';
import { API_URL } from '@/config';
import { User } from '@/api/types';
import { useDeviceRegistration, useMe, useUpdateMe } from '@/hooks';
import { profileSchema, type ProfileFormData } from '@/lib/schemas';
import { tokens } from '@/styles/tokens';

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

function toFormDefaults(user: User): ProfileFormData {
  return {
    displayName: user.profile.displayName ?? '',
    firstName: user.profile.firstName ?? '',
    lastName: user.profile.lastName ?? '',
    bio: user.profile.bio ?? '',
    locale: user.profile.locale ?? '',
    timezone: user.profile.timezone ?? '',
  };
}

export function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { showToast } = useToast();
  const { status: deviceRegistrationStatus, retryRegistration } = useDeviceRegistration({ autoRegister: false });
  const { data: user, error, isError, isLoading, refetch } = useMe();
  const updateMe = useUpdateMe();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      firstName: '',
      lastName: '',
      bio: '',
      locale: '',
      timezone: '',
    },
  });

  // Populate form once user data is available, and after a successful save
  React.useEffect(() => {
    if (user) reset(toFormDefaults(user));
  }, [user, reset]);

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

  const onSaveProfile = handleSubmit(async (data) => {
    try {
      const updated = await updateMe.mutateAsync({
        profile: {
          displayName: data.displayName.trim() || null,
          firstName: data.firstName.trim() || null,
          lastName: data.lastName.trim() || null,
          bio: data.bio.trim() || null,
          locale: data.locale || null,
          timezone: data.timezone || null,
        },
      });
      reset(toFormDefaults(updated));
      showToast({ message: 'Profile saved.', type: 'success' });
    } catch {
      showToast({ message: 'Could not save profile. Please retry.', type: 'error' });
    }
  });

  if (isLoading && !user) {
    return <LoadingState fullScreen message="Loading settings…" />;
  }

  if ((isError || !user) && error) {
    const message = error instanceof Error ? error.message : 'Unable to load account settings.';
    return <ErrorState fullScreen message={message} onRetry={() => void refetch()} />;
  }

  if (!user) {
    return <LoadingState fullScreen message="Preparing settings…" />;
  }

  const localeOptions = withCurrentOption(LOCALE_OPTIONS, user.profile.locale ?? '');
  const timezoneOptions = withCurrentOption(TIMEZONE_OPTIONS, user.profile.timezone ?? '');

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
          <Controller
            control={control}
            name="displayName"
            render={({ field, fieldState }) => (
              <Input
                label="Display name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Input
                    label="First name"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </View>
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Input
                    label="Last name"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </View>
          </View>
          <Controller
            control={control}
            name="bio"
            render={({ field, fieldState }) => (
              <TextArea
                label="Bio"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="locale"
            render={({ field }) => (
              <Select
                label="Locale"
                value={field.value}
                onValueChange={field.onChange}
                options={localeOptions}
                placeholder="Select locale"
              />
            )}
          />
          <Controller
            control={control}
            name="timezone"
            render={({ field }) => (
              <Select
                label="Timezone"
                value={field.value}
                onValueChange={field.onChange}
                options={timezoneOptions}
                placeholder="Select timezone"
              />
            )}
          />
          <Button
            label="Save Profile"
            loading={updateMe.isPending}
            disabled={!isDirty}
            onPress={() => void onSaveProfile()}
          />
        </Card>
      </Section>

      <Section title="Session">
        <Card variant="outlined" style={styles.listCard}>
          <ListItem title="Log Out" onPress={() => void handleSignOut()} />
          <Divider />
          <ListItem title="Delete Account" destructive onPress={handleDeleteAccount} />
        </Card>
      </Section>

      {__DEV__ ? (
        <Section title="Developer">
          <Card>
            <Text style={styles.meta}>API: {API_URL}</Text>
            <Text style={styles.meta}>User ID: {user.id}</Text>
            <Text style={styles.meta}>Device registration: {deviceRegistrationStatus.state}</Text>
            <Text style={styles.meta}>
              Supported: {deviceRegistrationStatus.supported ? 'yes' : 'no'} · Token present:{' '}
              {deviceRegistrationStatus.hasPushToken ? 'yes' : 'no'}
            </Text>
            <Text style={styles.meta}>Status: {deviceRegistrationStatus.message}</Text>
            {errors.root ? (
              <Text style={styles.meta}>Form error: {errors.root.message}</Text>
            ) : null}
            <Button label="Refetch /me" onPress={() => void refetch()} variant="secondary" size="sm" />
            <Button
              label="Retry Device Registration"
              onPress={() => void retryRegistration()}
              variant="secondary"
              size="sm"
            />
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
