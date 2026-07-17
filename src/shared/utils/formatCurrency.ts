export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

/**
 * Compact currency format for large numbers, e.g. 1000000 -> "$1 million".
 * Used for figures like volume/market cap where precision doesn't matter.
 *
 * Intl.NumberFormat ignores `compactDisplay: 'long'` when `style: 'currency'`
 * (it silently falls back to short form, e.g. "$1M") — so the number and
 * currency symbol are formatted separately here to get the word form.
 */
export function formatCompactUsd(value: number): string {
  const sign = value < 0 ? '-' : '';
  const compact = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'long',
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
  return `${sign}$${compact}`;
}
