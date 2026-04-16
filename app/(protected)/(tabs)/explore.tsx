import { StyleSheet, Text } from "react-native";
import { Card, Screen, Section } from "@/components/ui";
import { tokens } from "@/styles/tokens";

export default function ExploreScreen() {
  return (
    <Screen scroll>
      <Section title="Explore">
        <Text style={styles.subtitle}>This tab is a neutral placeholder for future experiments.</Text>
      </Section>

      <Card>
        <Text style={styles.cardTitle}>Starter Status</Text>
        <Text style={styles.cardBody}>
          Auth, routing, bootstrap, onboarding guard, and core app shell are wired as a reusable baseline.
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Next Likely Uses</Text>
        <Text style={styles.cardBody}>
          Replace this screen with whatever fits the product: feed, dashboard, activity, search, discovery, or anything else.
        </Text>
      </Card>
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
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.bold,
  },
  cardBody: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: 20,
  },
});
