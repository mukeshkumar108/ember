import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Screen, Section } from '@/components/ui';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

export default function ModalScreen() {
  const { colors } = useTheme();
  return (
    <Screen contentContainerStyle={staticStyles.container}>
      <Section title="Modal">
        <Text style={[staticStyles.subtitle, { color: colors.muted }]}>This is a non-product utility modal route.</Text>
      </Section>
      <Link href="/(protected)/(tabs)" dismissTo style={staticStyles.link}>
        <Text style={[staticStyles.linkText, { color: colors.primary }]}>Go to home screen</Text>
      </Link>
    </Screen>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
    textAlign: 'center',
  },
  linkText: {
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.base,
  },
  link: {
    marginTop: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
});
