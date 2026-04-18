import React from "react";
import { StyleSheet, Text } from "react-native";
import { ErrorState } from "@/components/feedback";
import { Button, Card, Screen, Section } from "@/components/ui";
import { useCompleteOnboarding } from "@/hooks/use-complete-onboarding";
import { tokens } from "@/styles/tokens";
import { useTheme } from "@/providers/theme-provider";

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { error, isPending, mutate } = useCompleteOnboarding();
  const errorMessage = error instanceof Error ? error.message : "";

  return (
    <Screen>
      <Section title="Welcome!">
        <Text style={[staticStyles.subtitle, { color: colors.muted }]}>Let&apos;s get you set up.</Text>
      </Section>

      <Card>
        <Text style={[staticStyles.bodyText, { color: colors.foreground }]}>
          This foundation uses a lightweight onboarding gate. Complete this step to enter the app shell.
        </Text>
      </Card>

      {errorMessage ? <ErrorState message={errorMessage} onRetry={() => mutate()} /> : null}

      <Button
        label="Get Started"
        loading={isPending}
        onPress={() => mutate()}
      />
    </Screen>
  );
}

const staticStyles = StyleSheet.create({
  subtitle: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  bodyText: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
});
