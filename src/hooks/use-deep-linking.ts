import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { getDeepLinkHandlers } from '@/config';

export function useDeepLinking() {
  useEffect(() => {
    let isMounted = true;

    void Linking.getInitialURL().then((initialUrl) => {
      if (!isMounted || !initialUrl) {
        return;
      }

      getDeepLinkHandlers().onInitialUrl?.(initialUrl);
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      getDeepLinkHandlers().onUrl?.(url);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
