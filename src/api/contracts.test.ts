import { describe, expect, it } from 'vitest';
import {
  meResponseSchema,
  registerDeviceResponseSchema,
} from '@/api/schemas';
import { ApiContractError, parseApiContract } from '@/api/validation';
import {
  validDeviceRegistrationResponse,
  validMeResponse,
  validUpdateMeResponse,
} from '@/test/fixtures/api';

describe('API contract parsing', () => {
  it('parses a valid GET /api/v1/me response', () => {
    const parsed = parseApiContract(
      meResponseSchema,
      validMeResponse,
      'GET /api/v1/me response',
    );

    expect(parsed.success).toBe(true);
    expect(parsed.data?.id).toBe('user_123');
    expect(parsed.data?.subscription.status).toBe('none');
  });

  it('fails loudly when /api/v1/me shape is invalid', () => {
    const invalidResponse = {
      ...validMeResponse,
      data: {
        ...validMeResponse.data,
        profile: {
          ...validMeResponse.data.profile,
          locale: 123,
        },
      },
    };

    expect(() =>
      parseApiContract(
        meResponseSchema,
        invalidResponse,
        'GET /api/v1/me response',
      ),
    ).toThrow(ApiContractError);
  });

  it('rejects unexpected enum drift for subscription.status', () => {
    const drifted = {
      ...validMeResponse,
      data: {
        ...validMeResponse.data,
        subscription: {
          ...validMeResponse.data.subscription,
          status: 'canceled',
        },
      },
    };

    expect(() =>
      parseApiContract(meResponseSchema, drifted, 'GET /api/v1/me response'),
    ).toThrow(ApiContractError);
  });

  it('parses a valid PATCH /api/v1/me response payload', () => {
    const parsed = parseApiContract(
      meResponseSchema,
      validUpdateMeResponse,
      'PATCH /api/v1/me response',
    );

    expect(parsed.success).toBe(true);
    expect(parsed.data?.profile.displayName).toBe('Updated Name');
  });

  it('parses a valid POST /api/v1/devices response payload', () => {
    const parsed = parseApiContract(
      registerDeviceResponseSchema,
      validDeviceRegistrationResponse,
      'POST /api/v1/devices response',
    );

    expect(parsed.success).toBe(true);
    expect(parsed.data?.platform).toBe('ios');
    expect(parsed.data?.pushToken).toContain('ExponentPushToken');
  });
});
