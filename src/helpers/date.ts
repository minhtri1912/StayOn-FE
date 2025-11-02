/**
 * Convert UTC date to Vietnam time (GMT+7)
 * @param dateString ISO date string or Date object
 * @returns Date object (used internally for formatting)
 */
export function toVietnamTime(dateString: string | Date): Date {
  // Parse the date string - if it's UTC, JavaScript will convert it to local time
  // But we want to ensure it's treated as UTC
  const date =
    typeof dateString === 'string'
      ? new Date(dateString.includes('Z') ? dateString : dateString + 'Z')
      : dateString;
  return date;
}

/**
 * Format date to Vietnam locale string
 * @param dateString ISO date string or Date object
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatVietnamDate(
  dateString: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = toVietnamTime(dateString);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  };

  // Use Intl.DateTimeFormat with Vietnam timezone to convert UTC to GMT+7
  return new Intl.DateTimeFormat('vi-VN', {
    ...defaultOptions,
    ...options
  }).format(date);
}

/**
 * Format date to Vietnam locale date string (without time)
 * @param dateString ISO date string or Date object
 * @returns Formatted date string (DD/MM/YYYY)
 */
export function formatVietnamDateOnly(dateString: string | Date): string {
  return formatVietnamDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Format date to Vietnam locale time string (without date)
 * @param dateString ISO date string or Date object
 * @returns Formatted time string (HH:mm:ss)
 */
export function formatVietnamTime(dateString: string | Date): string {
  return formatVietnamDate(dateString, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Format date to full Vietnam locale string (date + time)
 * @param dateString ISO date string or Date object
 * @returns Formatted date string (DD/MM/YYYY, HH:mm:ss)
 */
export function formatVietnamDateTime(dateString: string | Date): string {
  return formatVietnamDate(dateString);
}
