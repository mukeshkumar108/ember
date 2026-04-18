import { Slot } from 'expo-router';
import { AppErrorBoundary, NetworkBanner } from '@/components/feedback';
import { AppProviders } from '@/providers';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(public)',
};

export default function RootLayout() {
  return (
    <AppProviders>
      <AppErrorBoundary>
        <NetworkBanner />
        <Slot />
      </AppErrorBoundary>
    </AppProviders>
  );
}
