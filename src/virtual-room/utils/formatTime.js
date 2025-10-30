/**
 * Safe time formatter - NEVER returns NaN
 * @param {string | number | undefined} input - "MM:SS" string or seconds number
 * @param {string} fallback - Default value if input is invalid
 * @returns {string} Always returns valid "MM:SS" format
 */
export function formatTimeSafe(input, fallback = '25:00') {
  // If already a valid MM:SS string, return it
  if (typeof input === 'string' && /^\d{1,2}:\d{2}$/.test(input)) {
    return input;
  }

  // If it's a valid number, convert to MM:SS
  if (typeof input === 'number' && Number.isFinite(input)) {
    const total = Math.max(0, Math.floor(input));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // Fallback for undefined/null/invalid
  return fallback;
}
