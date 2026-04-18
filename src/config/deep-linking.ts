import * as Linking from 'expo-linking';

export const APP_DEEP_LINK_SCHEME = 'ember';

export type DeepLinkHandlers = {
  onInitialUrl?: (url: string) => void;
  onUrl?: (url: string) => void;
};

let deepLinkHandlers: DeepLinkHandlers = {};

export function setDeepLinkHandlers(next: DeepLinkHandlers) {
  deepLinkHandlers = {
    ...deepLinkHandlers,
    ...next,
  };
}

export function getDeepLinkHandlers() {
  return deepLinkHandlers;
}

export function createAppDeepLink(path: string, queryParams?: Record<string, string>) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return Linking.createURL(normalizedPath, {
    scheme: APP_DEEP_LINK_SCHEME,
    queryParams,
  });
}
