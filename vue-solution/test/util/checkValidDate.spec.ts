import { describe, it } from 'vitest';

import { ErrorMessages } from '@/enums/ErrorMessages';
import { checkValidDate } from '@/util/checkValidDate';


const SUITE = 'checkValidDate';
const { MustBeInPast, InvalidDate } = ErrorMessages;

describe.concurrent(SUITE, () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  it(`${SUITE} - Valid date in the past`, async ({ expect }) => {
    const { day, month, year } = checkValidDate(1, 1, 2023);
    expect(day).toBe(undefined);
    expect(month).toBe(undefined);
    expect(year).toBe(undefined);
  });

  it(`${SUITE} - ${MustBeInPast}`, async ({ expect }) => {
    const { day, month, year } = checkValidDate(1, 1, 2024);
    expect(day).toBe(undefined);
    expect(month).toBe(undefined);
    expect(year).toBe(MustBeInPast);
  });

  it(`${SUITE} - 0 Day ${InvalidDate}`, async ({ expect }) => {
    const { day, month, year } = checkValidDate(0, 1, 2023);
    expect(day).toBe(undefined);
    expect(month).toBe(undefined);
    expect(year).toBe(InvalidDate);
  });

  it(`${SUITE} - 0 Month ${InvalidDate}`, async ({ expect }) => {
    const { day, month, year } = checkValidDate(1, 0, 2023);
    expect(day).toBe(undefined);
    expect(month).toBe(undefined);
    expect(year).toBe(InvalidDate);
  });

  it(`${SUITE} - 0 Year ${InvalidDate}`, async ({ expect }) => {
    const { day, month, year } = checkValidDate(1, 1, 0);
    expect(day).toBe(undefined);
    expect(month).toBe(undefined);
    expect(year).toBe(InvalidDate);
  });

  it(`${SUITE} - Year ${MustBeInPast}`, async ({ expect }) => {
    const { day, month, year } = checkValidDate(1, 1, 2999);
    expect(day).toBe(undefined);
    expect(month).toBe(undefined);
    expect(year).toBe(MustBeInPast);
  });

  it(`${SUITE} - Month ${MustBeInPast}`, async ({ expect }) => {
    const { day, month, year } = checkValidDate(1, currentMonth + 1, currentYear);
    expect(day).toBe(undefined);
    expect(month).toBe(MustBeInPast);
    expect(year).toBe(undefined);
  });

  it(`${SUITE} - Day ${MustBeInPast}`, async ({ expect }) => {
    const { day, month, year } = checkValidDate(currentDay + 1, currentMonth, currentYear);
    expect(day).toBe(MustBeInPast);
    expect(month).toBe(undefined);
    expect(year).toBe(undefined);
  });
});
