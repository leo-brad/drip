import { describe, expect, test, } from '@jest/globals';
import * as byteArray from '~/lib/byteArray';

describe('[lib] byteArray', () => {
  test('byteArray convert result should correct.', () => {
    const i = 42342342342342n;
    expect(byteArray.toInt(byteArray.fromInt(i))).toBe(i);
  });
});
