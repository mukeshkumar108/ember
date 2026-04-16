import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { Button, Card, Input, Screen, Section } from '@/components/ui';
import { tokens } from '@/styles/tokens';

export default function PlaygroundScreen() {
  return (
    <Screen scroll>
      <Section title="UI Playground">
        <Text style={styles.subtitle}>Internal-only component checks for Ember foundation primitives.</Text>
      </Section>

      <Section title="Buttons">
        <Button label="Primary" onPress={() => undefined} />
        <Button label="Secondary" onPress={() => undefined} variant="secondary" />
        <Button label="Danger" onPress={() => undefined} variant="danger" />
        <Button label="Disabled" disabled onPress={() => undefined} />
        <Button label="Loading" loading onPress={() => undefined} />
      </Section>

      <Section title="Inputs">
        <Input label="Labeled input" placeholder="Type here" />
        <Input placeholder="Default input" />
        <Input error="This field has an error." label="Input with error" placeholder="Invalid value" />
      </Section>

      <Section title="Card">
        <Card>
          <Text style={styles.cardTitle}>Card Title</Text>
          <Text style={styles.cardBody}>Cards provide consistent grouped container styling.</Text>
        </Card>
      </Section>

      <Section title="Feedback States">
        <View style={styles.stateDemo}>
          <LoadingState message="Loading state example" />
        </View>
        <ErrorState message="Example error message." onRetry={() => undefined} />
        <EmptyState title="Nothing here yet" description="Example empty-state copy." />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  cardTitle: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.lg,
    fontWeight: tokens.typography.weights.bold,
  },
  cardBody: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  stateDemo: {
    minHeight: 120,
  },
});
