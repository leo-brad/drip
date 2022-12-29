import { describe, expect, test, } from '@jest/globals';
import ContentHash from '~/class/ContentHash';

describe('[class] ContentHash', () => {
  test('ContentHash hash result should be correct.', () => {
    const ch = new ContentHash();
    expect(ch.getHash('fsfsggsgsdfsfadsfas')).toBe('玆枓憆');
  });
});

