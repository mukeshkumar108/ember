/**
 * Shared utility functions for Ember apps.
 *
 * Keep functions pure and dependency-free (no RN imports).
 * Add project-specific helpers here when they're used in 2+ places.
 */

// ─── Strings ─────────────────────────────────────────────────────────────────

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis.
 *   truncate('Hello world', 7) → 'Hello w…'
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '\u2026';
}

/**
 * Returns a string with the first character uppercased.
 *   capitalize('hello') → 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Simple pluralization for English.
 *   pluralize(1, 'item')            → '1 item'
 *   pluralize(3, 'item')            → '3 items'
 *   pluralize(0, 'child','children') → '0 children'
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}

// ─── Numbers ─────────────────────────────────────────────────────────────────

/**
 * Formats a number as a currency string.
 *   formatCurrency(12.5, 'USD') → '$12.50'
 *   formatCurrency(1234, 'GBP') → '£1,234.00'
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

/**
 * Compact number formatting for counts and stats.
 *   compactNumber(1234)    → '1.2K'
 *   compactNumber(1500000) → '1.5M'
 */
export function compactNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

// ─── Dates ───────────────────────────────────────────────────────────────────

/**
 * Returns a human-readable relative time string.
 *   relativeTime(new Date(Date.now() - 60000))  → '1 minute ago'
 *   relativeTime(new Date(Date.now() + 3600000)) → 'in 1 hour'
 */
export function relativeTime(date: Date, locale = 'en-US'): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (Math.abs(diffSec) < 45) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 45) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHour) < 22) return rtf.format(diffHour, 'hour');
  if (Math.abs(diffDay) < 6) return rtf.format(diffDay, 'day');
  if (Math.abs(diffWeek) < 4) return rtf.format(diffWeek, 'week');
  if (Math.abs(diffMonth) < 11) return rtf.format(diffMonth, 'month');
  return rtf.format(diffYear, 'year');
}

/**
 * Formats a date as a short readable string.
 *   formatDate(new Date()) → 'Apr 16, 2026'
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// ─── Validation ───────────────────────────────────────────────────────────────

/** Returns true if a string looks like a valid email address. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Returns true for a non-empty, non-whitespace-only string. */
export function isNonEmpty(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
