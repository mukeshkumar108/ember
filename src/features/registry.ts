type FeatureRegistry = {
  notifications: {
    enabled: boolean;
    description: string;
  };
  offlineAwareness: {
    enabled: boolean;
    description: string;
  };
  analytics: {
    enabled: boolean;
    description: string;
  };
  uploads: {
    enabled: boolean;
    description: string;
  };
  payments: {
    enabled: boolean;
    description: string;
  };
  subscriptions: {
    enabled: boolean;
    description: string;
  };
  multiStepOnboarding: {
    enabled: boolean;
    description: string;
  };
};

export type FeatureKey = keyof FeatureRegistry;

function parseFeatureFlag(rawValue: string | undefined, defaultValue: boolean) {
  if (rawValue === undefined) {
    return defaultValue;
  }

  const normalized = rawValue.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1') {
    return true;
  }
  if (normalized === 'false' || normalized === '0') {
    return false;
  }

  return defaultValue;
}

const featureRegistry: FeatureRegistry = {
  notifications: {
    enabled: parseFeatureFlag(process.env.EXPO_PUBLIC_FEATURE_NOTIFICATIONS, true),
    description: 'Device registration and notification listener baseline.',
  },
  offlineAwareness: {
    enabled: parseFeatureFlag(process.env.EXPO_PUBLIC_FEATURE_OFFLINE_AWARENESS, true),
    description: 'Network reachability awareness and offline banner baseline.',
  },
  analytics: {
    enabled: parseFeatureFlag(process.env.EXPO_PUBLIC_FEATURE_ANALYTICS, false),
    description: 'Reserved analytics feature module slot.',
  },
  uploads: {
    enabled: parseFeatureFlag(process.env.EXPO_PUBLIC_FEATURE_UPLOADS, false),
    description: 'Reserved uploads feature module slot.',
  },
  payments: {
    enabled: parseFeatureFlag(process.env.EXPO_PUBLIC_FEATURE_PAYMENTS, false),
    description: 'Reserved payments feature module slot.',
  },
  subscriptions: {
    enabled: parseFeatureFlag(process.env.EXPO_PUBLIC_FEATURE_SUBSCRIPTIONS, false),
    description: 'Reserved subscriptions feature module slot.',
  },
  multiStepOnboarding: {
    enabled: parseFeatureFlag(process.env.EXPO_PUBLIC_FEATURE_MULTI_STEP_ONBOARDING, false),
    description: 'Reserved advanced onboarding module slot.',
  },
};

export function getFeatureRegistry() {
  return featureRegistry;
}

export function getFeatureConfig(key: FeatureKey) {
  return featureRegistry[key];
}

export function isFeatureEnabled(key: FeatureKey) {
  return featureRegistry[key].enabled;
}

export function listEnabledFeatures() {
  return (Object.keys(featureRegistry) as FeatureKey[]).filter((key) =>
    featureRegistry[key].enabled,
  );
}
