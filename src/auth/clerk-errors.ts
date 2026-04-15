export function getClerkErrorMessage(error: unknown): string {
  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  if (error instanceof Error && error.message) {
    const known = extractClerkNestedMessage(error);
    return known || error.message;
  }

  const fallback = extractClerkNestedMessage(error);
  return fallback || 'Something went wrong. Please try again.';
}

function extractClerkNestedMessage(error: unknown): string | null {
  if (!error || typeof error !== 'object') {
    return null;
  }

  const maybeErrors = (error as { errors?: unknown }).errors;
  if (!Array.isArray(maybeErrors) || maybeErrors.length === 0) {
    return null;
  }

  const first = maybeErrors[0];
  if (!first || typeof first !== 'object') {
    return null;
  }

  const longMessage = (first as { longMessage?: unknown }).longMessage;
  if (typeof longMessage === 'string' && longMessage.trim().length > 0) {
    return longMessage;
  }

  const message = (first as { message?: unknown }).message;
  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }

  return null;
}
