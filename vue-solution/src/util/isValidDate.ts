export const isValidDate = (date: string): boolean => {
  // Date format: YYYY-MM-DD
  var datePattern = /^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

  // Check if the date string format is a match
  var matchArray = date.match(datePattern);
  if (matchArray == null) {
    return false;
  }

  // Remove any non digit characters
  var dateString = date.replace(/\D/g, '');

  // Parse integer values from the date string
  var year = parseInt(dateString.slice(0, 4));
  var month = parseInt(dateString.slice(4, 6));
  var day = parseInt(dateString.slice(6, 8));

  // Define the number of days per month
  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    daysInMonth[1] = 29;
  }

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1] || year < 1) {
    return false;
  }
  return true;
};
