import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createAppDeepLink,
  getDeepLinkHandlers,
  setDeepLinkHandlers,
} from './deep-linking';

vi.mock('expo-linking', () => ({
  createURL: vi.fn((path: string, options: { scheme?: string; queryParams?: Record<string, string> }) => {
    const base = `${options.scheme ?? 'ember'}://${path.replace(/^\//, '')}`;
    if (!options.queryParams || Object.keys(options.queryParams).length === 0) {
      return base;
    }

    const query = new URLSearchParams(options.queryParams).toString();
    return `${base}?${query}`;
  }),
}));

describe('deep linking config', () => {
  beforeEach(() => {
    setDeepLinkHandlers({
      onInitialUrl: undefined,
      onUrl: undefined,
    });
  });

  it('creates scheme-based app deep links', () => {
    const url = createAppDeepLink('/auth/callback', { source: 'email' });
    expect(url).toContain('ember://auth/callback');
    expect(url).toContain('source=email');
  });

  it('stores and exposes deep link handlers', () => {
    const onInitialUrl = vi.fn();
    const onUrl = vi.fn();

    setDeepLinkHandlers({ onInitialUrl, onUrl });
    const handlers = getDeepLinkHandlers();

    expect(handlers.onInitialUrl).toBe(onInitialUrl);
    expect(handlers.onUrl).toBe(onUrl);
  });
});
