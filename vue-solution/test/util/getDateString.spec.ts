import { getDateString } from '@/util/getDateString';
import { describe, it } from 'vitest';

const SUITE = 'getDateString';

describe.concurrent(SUITE, () => {
  it(`${SUITE} - Numbers provided`, async ({ expect }) => {
    expect(getDateString(1, 1, 2023)).not.toBe(undefined);
    expect(getDateString(1, 31, 2023)).not.toBe(undefined);
    expect(getDateString(31, 12, 2023)).not.toBe(undefined);
    expect(getDateString(30, 4, 2023)).not.toBe(undefined);
  });

  it(`${SUITE} - Missing inputs`, async ({ expect }) => {
    expect(getDateString(1, undefined, undefined)).toBe(undefined);
    expect(getDateString(undefined, 1, undefined)).toBe(undefined);
    expect(getDateString(undefined, undefined, 1)).toBe(undefined);
    expect(getDateString(1, 1, undefined)).toBe(undefined);
    expect(getDateString(1, undefined, 1)).toBe(undefined);
    expect(getDateString(undefined, 1, 1)).toBe(undefined);
  });
});
