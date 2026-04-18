import { StyleSheet, Text } from 'react-native';
import { Card, Screen, Section } from '@/components/ui';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

export default function HomeScreen() {
  const { colors } = useTheme();
  return (
    <Screen scroll>
      <Section title="Welcome">
        <Text style={[staticStyles.lead, { color: colors.muted }]}>
          Ember is a reusable Expo and React Native foundation for the forgingfire backend.
        </Text>
      </Section>

      <Section title="Foundation Status">
        <Card>
          <Text style={[staticStyles.cardTitle, { color: colors.foreground }]}>Authentication</Text>
          <Text style={[staticStyles.body, { color: colors.foreground }]}>
            Clerk auth is wired with protected routing and onboarding gating.
          </Text>
        </Card>
        <Card>
          <Text style={[staticStyles.cardTitle, { color: colors.foreground }]}>Bootstrap</Text>
          <Text style={[staticStyles.body, { color: colors.foreground }]}>
            Startup state is loaded from /api/v1/me and used to drive route guards.
          </Text>
        </Card>
      </Section>
    </Screen>
  );
}

const staticStyles = StyleSheet.create({
  lead: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  cardTitle: {
    fontFamily: tokens.typography.fonts.bold,
    fontSize: tokens.typography.sizes.lg,
  },
  body: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
});
