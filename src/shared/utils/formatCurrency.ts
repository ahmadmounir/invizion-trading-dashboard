import i18n from '@/shared/utils/i18n';

function getCurrencySymbol(currency: string): string {
  const parts = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency.toUpperCase(),
    currencyDisplay: 'narrowSymbol',
  }).formatToParts(0);
  return parts.find((part) => part.type === 'currency')?.value ?? currency.toUpperCase();
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

/**
 * Compact currency format for large numbers, e.g. 1000000 -> "$1 million".
 * Used for figures like volume/market cap where precision doesn't matter.
 * The word ("million"/"milyon"/"مليون") is translated automatically based on
 * the current app language, via ICU's built-in locale data.
 *
 * Intl.NumberFormat ignores `compactDisplay: 'long'` when `style: 'currency'`
 * (it silently falls back to short form, e.g. "$1M") — so the number and
 * currency symbol are formatted separately here to get the word form.
 */
export function formatCompactCurrency(value: number, currency: string = 'USD'): string {
  const sign = value < 0 ? '-' : '';
  const compact = new Intl.NumberFormat(i18n.language, {
    notation: 'compact',
    compactDisplay: 'long',
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
  return `${sign}${getCurrencySymbol(currency)}${compact}`;
}
