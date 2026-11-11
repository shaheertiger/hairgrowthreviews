const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/**
 * Normalises a content date to ISO `YYYY-MM-DD`, or returns undefined.
 * Accepts ISO dates and the "Month YYYY" labels older pages carry
 * ("August 2026" → "2026-08-01"), so JSON-LD and the sitemap always get a
 * valid date instead of a display string.
 */
export function toIsoDate(date?: string): string | undefined {
  if (!date) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const m = date.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return undefined;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  return month === -1 ? undefined : `${m[2]}-${String(month + 1).padStart(2, "0")}-01`;
}
