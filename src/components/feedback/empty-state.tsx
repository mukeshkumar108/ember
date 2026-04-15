import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface EmptyStateProps {
  title: string;
  description?: string;
  iconName?: string;
}

export function EmptyState({ title, description, iconName = 'tray' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <IconSymbol name={iconName} size={64} color="#ccc" />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
