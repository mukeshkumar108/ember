import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Screen, Section } from '@/components/ui';
import { tokens } from '@/styles/tokens';

export default function ModalScreen() {
  return (
    <Screen contentContainerStyle={styles.container}>
      <Section title="Modal">
        <Text style={styles.subtitle}>This is a non-product utility modal route.</Text>
      </Section>
      <Link href="/(protected)/(tabs)" dismissTo style={styles.link}>
        <Text style={styles.linkText}>Go to home screen</Text>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.base,
    textAlign: 'center',
  },
  linkText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.medium,
  },
  link: {
    marginTop: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
});
