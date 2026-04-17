import { ZodError, type ZodType } from 'zod';

export class ApiContractError extends Error {
  readonly context: string;
  readonly issues: ZodError['issues'];

  constructor(context: string, error: ZodError) {
    const issueSummary = error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    super(`API contract mismatch for ${context}. ${issueSummary}`);
    this.name = 'ApiContractError';
    this.context = context;
    this.issues = error.issues;
  }
}

export function parseApiContract<T>(
  schema: ZodType<T>,
  payload: unknown,
  context: string,
): T {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiContractError(context, parsed.error);
  }

  return parsed.data;
}
