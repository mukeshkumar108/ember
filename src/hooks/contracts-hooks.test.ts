import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ApiContractError } from '@/api/validation';
import { useCompleteOnboarding } from '@/hooks/use-complete-onboarding';
import { useMe } from '@/hooks/use-me';
import { useUpdateMe } from '@/hooks/use-update-me';
import {
  validMeResponse,
  validMeUserData,
  validUpdateMeResponse,
} from '@/test/fixtures/api';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';

vi.mock('./use-api', () => ({
  useApi: vi.fn(),
}));

vi.mock('@clerk/clerk-expo', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

describe('Critical hook boundary behavior', () => {
  const requestMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useApi as unknown as Mock).mockReturnValue({ request: requestMock });
    (useAuth as unknown as Mock).mockReturnValue({ isSignedIn: true, isLoaded: true });
    (useQuery as unknown as Mock).mockImplementation((opts) => opts);
    (useMutation as unknown as Mock).mockImplementation((opts) => opts);
  });

  it('useMe unwraps parsed user data on success', async () => {
    requestMock.mockResolvedValue(validMeResponse);

    const queryOptions = useMe() as unknown as {
      enabled: boolean;
      queryFn: () => Promise<typeof validMeUserData>;
    };

    expect(queryOptions.enabled).toBe(true);
    await expect(queryOptions.queryFn()).resolves.toEqual(validMeResponse.data);
  });

  it('useMe propagates parse failures as errors', async () => {
    requestMock.mockResolvedValue({
      ...validMeResponse,
      data: {
        ...validMeResponse.data,
        subscription: { ...validMeResponse.data.subscription, status: 'canceled' },
      },
    });

    const queryOptions = useMe() as unknown as {
      queryFn: () => Promise<unknown>;
    };

    await expect(queryOptions.queryFn()).rejects.toBeInstanceOf(ApiContractError);
  });

  it('useMe throws backend error message when success=false', async () => {
    requestMock.mockResolvedValue({
      success: false,
      data: null,
      error: { message: 'no active user', code: 'NO_USER' },
    });

    const queryOptions = useMe() as unknown as {
      queryFn: () => Promise<unknown>;
    };

    await expect(queryOptions.queryFn()).rejects.toThrow('no active user');
  });

  it('useUpdateMe runs patch mutation and invalidates me query on success', async () => {
    const queryClient = {
      setQueryData: vi.fn(),
      invalidateQueries: vi.fn().mockResolvedValue(undefined),
      refetchQueries: vi.fn().mockResolvedValue(undefined),
    };

    (useQueryClient as unknown as Mock).mockReturnValue(queryClient);
    requestMock.mockResolvedValue(validUpdateMeResponse);

    const mutationOptions = useUpdateMe() as unknown as {
      mutationFn: (body: unknown) => Promise<typeof validUpdateMeResponse.data>;
      onSuccess: (user: typeof validUpdateMeResponse.data) => Promise<void>;
    };

    const user = await mutationOptions.mutationFn({ profile: { displayName: 'Updated Name' } });
    expect(user.profile.displayName).toBe('Updated Name');
    expect(requestMock).toHaveBeenCalledWith('/api/v1/me', expect.objectContaining({ method: 'PATCH' }));

    await mutationOptions.onSuccess(user);
    expect(queryClient.setQueryData).toHaveBeenCalledWith(['me'], user);
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['me'] });
    expect(queryClient.refetchQueries).toHaveBeenCalledWith({ queryKey: ['me'], type: 'active' });
  });

  it('useCompleteOnboarding invalidates and refetches me on success', async () => {
    const queryClient = {
      invalidateQueries: vi.fn().mockResolvedValue(undefined),
      refetchQueries: vi.fn().mockResolvedValue(undefined),
    };

    (useQueryClient as unknown as Mock).mockReturnValue(queryClient);
    requestMock.mockResolvedValue(validMeResponse);

    const mutationOptions = useCompleteOnboarding() as unknown as {
      mutationFn: () => Promise<typeof validMeResponse.data>;
      onSuccess: () => Promise<void>;
    };

    await mutationOptions.mutationFn();
    expect(requestMock).toHaveBeenCalledWith(
      '/api/v1/me',
      expect.objectContaining({
        method: 'PATCH',
        body: { onboarding: { completed: true } },
      }),
    );

    await mutationOptions.onSuccess();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['me'] });
    expect(queryClient.refetchQueries).toHaveBeenCalledWith({ queryKey: ['me'], type: 'active' });
  });
});
