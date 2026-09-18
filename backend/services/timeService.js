/**
 * Time Allocation & Confirmation Service
 *
 * Dedicated service module handling date/time validation and time slot confirmation.
 * Separated cleanly so logic (e.g., dynamic slot allocation, buffer rules, calendar sync)
 * can easily be updated without altering the controller layer.
 */

/**
 * Format a Date string or YYYY-MM-DD into a readable format: "18 September 2026"
 */
function formatReadableDate(dateString) {
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      // YYYY-MM-DD local parsing to avoid UTC shift
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch (e) {
    // fallback to original string
  }
  return dateString;
}

/**
 * Format 24-hour "HH:mm" time to standard "hh:mm AM/PM"
 */
function formatTimeWithPeriod(timeString) {
  if (!timeString) return '10:00 AM';

  // If already in AM/PM format, return trimmed
  if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
    return timeString.trim();
  }

  const [hourStr, minStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr || '0', 10);

  if (isNaN(hour)) {
    return timeString;
  }

  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // 0 hour should be 12
  const formattedMin = min < 10 ? `0${min}` : `${min}`;

  return `${hour}:${formattedMin} ${period}`;
}

/**
 * Validate input date & preferred time
 * @param {string} date
 * @param {string} preferredTime
 * @returns {{ valid: boolean, error?: string }}
 */
function validateDateTime(date, preferredTime) {
  if (!date || typeof date !== 'string' || date.trim() === '') {
    return { valid: false, error: 'A valid date is required' };
  }

  if (!preferredTime || typeof preferredTime !== 'string' || preferredTime.trim() === '') {
    return { valid: false, error: 'A preferred time is required' };
  }

  // Check if date is valid
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { valid: false, error: 'Invalid date format provided' };
  }

  return { valid: true };
}

/**
 * Generate and confirm time slot based on user preference
 * @param {string} date
 * @param {string} preferredTime
 * @returns {{ confirmedTime: string, formattedDate: string, confirmationMessage: string }}
 */
function generateConfirmedTime(date, preferredTime) {
  const formattedDate = formatReadableDate(date);
  const confirmedTime = formatTimeWithPeriod(preferredTime);
  const confirmationMessage = 'Your time has been successfully confirmed.';

  return {
    confirmedTime,
    formattedDate,
    confirmationMessage,
  };
}

module.exports = {
  formatReadableDate,
  formatTimeWithPeriod,
  validateDateTime,
  generateConfirmedTime,
};
