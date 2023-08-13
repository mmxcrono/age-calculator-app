export const getDateString = (day?: number, month?: number, year?: number): string | undefined => {
  const PAD = '0';

  if (day && month && year) {
    const monthPadded = month.toString().padStart(2, PAD);
    const yearPadded = year.toString().padStart(4, PAD);
    const dayPadded = day.toString().padStart(2, PAD);
    const dateString = `${yearPadded}-${monthPadded}-${dayPadded}`;

    return dateString;
  }

  return undefined;
};
