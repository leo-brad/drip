import { describe, expect, test, } from '@jest/globals';
import * as nonZeroByteArray from '~/lib/nonZeroByteArray';

describe('[lib] nonZeroByteArray', () => {
  test('nonZeroByteArray convert result should correct.', () => {
    const i = 42523234234242342n;
    expect(nonZeroByteArray.toInt(nonZeroByteArray.fromInt(i))).toBe(i);
  });
});
