import { describe, expect, test, } from '@jest/globals';
import * as utf8Array from '~/lib/utf8Array';

describe('[lib] utf8Array', () => {
  test('utf8Array convert result should correct.', () => {
    const i = 424234255n;
    expect(utf8Array.toInt(utf8Array.fromInt(i))).toBe(i);
  });
});
