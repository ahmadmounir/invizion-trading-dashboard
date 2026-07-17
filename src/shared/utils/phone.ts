/**
 * Helpers for Turkish mobile numbers.
 * Local numbers are always 10 digits starting with "5" (e.g. 5551234567).
 * The API expects the number prefixed with the "90" country code (e.g. 905551234567).
 */

export const TURKEY_DIAL_CODE = "90";

export const TURKISH_MOBILE_REGEX = /^5\d{9}$/;

export function isValidTurkishMobile(value: string): boolean {
  return TURKISH_MOBILE_REGEX.test(value);
}

export function toTurkishPhoneNumber(localNumber: string): string {
  return `${TURKEY_DIAL_CODE}${localNumber}`;
}

/**
 * Extracts the 10-digit local number from a stored value that may already
 * include the "90" country code (or other stray characters). Returns "" if
 * no valid local number can be recovered.
 */
export function fromTurkishPhoneNumber(phone?: string | null): string {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith(TURKEY_DIAL_CODE) ? digits.slice(2) : digits;

  return isValidTurkishMobile(local) ? local : "";
}
