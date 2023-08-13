import { ErrorMessages } from '@/enums/ErrorMessages';

import { isValidDate } from './isValidDate';
import { getDateString } from './getDateString';

export interface DateValidation {
  day?: string | undefined;
  month?: string | undefined;
  year?: string | undefined;
}

export const checkValidDate = (day?: number, month?: number, year?: number): DateValidation => {
  let dateValidation: DateValidation = {};

  if (day && month && year) {
    const dateString = getDateString(day, month, year);
    if (!dateString) {
      dateValidation.year = ErrorMessages.InvalidDate;
      return dateValidation;
    }
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const localDate = new Date();

    localDate.setFullYear(year);
    localDate.setMonth(month - 1);
    localDate.setDate(day);

    if (!isValidDate(dateString)) {
      dateValidation.year = ErrorMessages.InvalidDate;
    } else if (localDate.getTime() > Date.now()) {
      if (year > currentYear) {
        dateValidation.year = ErrorMessages.MustBeInPast;
      } else if (month > currentMonth) {
        dateValidation.month = ErrorMessages.MustBeInPast;
      } else {
        dateValidation.day = ErrorMessages.MustBeInPast;
      }
    } else if (dateValidation.day === ErrorMessages.InvalidDate) {
      dateValidation.day = undefined;
    }
  }
  else {
    dateValidation.year = ErrorMessages.InvalidDate;
    return dateValidation;
  }

  return dateValidation;
};
