/**
 *  Get current time in milliseconds
 * @returns number
 */
export const getCurrentTime = () => {
  const now = new Date();
  return now.getTime();
};

/**
 * Get full month names
 * @param month number
 * @returns string
 */
export const getMonthNames = (month: number) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[month];
};

/**
 * Format date by dash
 * @param date Date
 * @returns string
 */
export const formatDatebyDash = (date: Date) => {
  const dateTime = new Date(date);

  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();

  return year + '-' + month + '-' + day;
};

/**
 * Format date to locale date string
 * @param dateString
 * @returns string
 */
export function formatDateToLocaleDateString(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
