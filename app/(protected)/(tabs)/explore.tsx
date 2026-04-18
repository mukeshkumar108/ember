import { StyleSheet, Text } from "react-native";
import { Card, Screen, Section } from "@/components/ui";
import { tokens } from "@/styles/tokens";
import { useTheme } from "@/providers/theme-provider";

export default function ExploreScreen() {
  const { colors } = useTheme();
  return (
    <Screen scroll>
      <Section title="Explore">
        <Text style={[staticStyles.subtitle, { color: colors.muted }]}>This tab is a neutral placeholder for future experiments.</Text>
      </Section>

      <Card>
        <Text style={[staticStyles.cardTitle, { color: colors.foreground }]}>Starter Status</Text>
        <Text style={[staticStyles.cardBody, { color: colors.foreground }]}>
          Auth, routing, bootstrap, onboarding guard, and core app shell are wired as a reusable baseline.
        </Text>
      </Card>

      <Card>
        <Text style={[staticStyles.cardTitle, { color: colors.foreground }]}>Next Likely Uses</Text>
        <Text style={[staticStyles.cardBody, { color: colors.foreground }]}>
          Replace this screen with whatever fits the product: feed, dashboard, activity, search, discovery, or anything else.
        </Text>
      </Card>
    </Screen>
  );
}

const staticStyles = StyleSheet.create({
  subtitle: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  cardTitle: {
    fontFamily: tokens.typography.fonts.bold,
    fontSize: tokens.typography.sizes.base,
  },
  cardBody: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: 20,
  },
});
