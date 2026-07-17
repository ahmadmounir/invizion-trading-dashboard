export const COINS_PER_PAGE = 20;
export const TOTAL_PAGES = 5;
export const TOTAL_COINS = COINS_PER_PAGE * TOTAL_PAGES;

export interface CurrencyOption {
  code: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'usd', label: 'USD' },
  { code: 'eur', label: 'EUR' },
  { code: 'try', label: 'TRY' },
  { code: 'sar', label: 'SAR' },
  { code: 'gbp', label: 'GBP' },
  { code: 'jpy', label: 'JPY' },
  { code: 'aud', label: 'AUD' },
  { code: 'cad', label: 'CAD' },
  { code: 'cny', label: 'CNY' },
];

export const DEFAULT_CURRENCY = 'usd';
