import { StyleSheet, Text } from 'react-native';
import { Card, Screen, Section } from '@/components/ui';
import { tokens } from '@/styles/tokens';

export default function HomeScreen() {
  return (
    <Screen scroll>
      <Section title="Welcome">
        <Text style={styles.lead}>
          Ember is a reusable Expo and React Native foundation for the forgingfire backend.
        </Text>
      </Section>

      <Section title="Foundation Status">
        <Card>
          <Text style={styles.cardTitle}>Authentication</Text>
          <Text style={styles.body}>
            Clerk auth is wired with protected routing and onboarding gating.
          </Text>
        </Card>
        <Card>
          <Text style={styles.cardTitle}>Bootstrap</Text>
          <Text style={styles.body}>
            Startup state is loaded from /api/v1/me and used to drive route guards.
          </Text>
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  cardTitle: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.lg,
    fontWeight: tokens.typography.weights.bold,
  },
  body: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
});
