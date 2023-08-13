import { isValidDate } from '@/util/isValidDate';
import { describe, it } from 'vitest';

const SUITE = 'isValidDate';

describe.concurrent(SUITE, () => {
  it(`${SUITE} - valid dates`, async ({ expect }) => {
    expect(isValidDate('2023-01-01')).toBe(true);
    expect(isValidDate('2023-01-31')).toBe(true);
    expect(isValidDate('2023-12-31')).toBe(true);
    expect(isValidDate('2024-04-30')).toBe(true);
  });

  it(`${SUITE} - invalid dates`, async ({ expect }) => {
    expect(isValidDate('2023-00-01')).toBe(false);
    expect(isValidDate('2023-13-31')).toBe(false);
    expect(isValidDate('2023-12-32')).toBe(false);
    expect(isValidDate('2024-04-31')).toBe(false);
  });
});
