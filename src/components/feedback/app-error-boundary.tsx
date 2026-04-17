import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Screen, Section } from '@/components/ui';
import { tokens } from '@/styles/tokens';

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('AppErrorBoundary caught an unhandled render error', error);
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <Screen>
        <Section title="App Error">
          <Card>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              Ember caught a component crash. You can retry the current view.
            </Text>
            {__DEV__ ? (
              <View style={styles.devBlock}>
                <Text style={styles.devTitle}>Developer details</Text>
                <Text style={styles.devMessage}>{this.state.error.message}</Text>
              </View>
            ) : null}
            <Button label="Try Again" onPress={this.handleReset} />
          </Card>
        </Section>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.xl,
    fontWeight: tokens.typography.weights.bold,
  },
  message: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  devBlock: {
    borderWidth: 1,
    borderColor: tokens.colors.muted,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  devTitle: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
  },
  devMessage: {
    color: tokens.colors.danger,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: 18,
  },
});
