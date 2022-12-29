import { describe, expect, test, } from '@jest/globals';
import contentCompare from '~/lib/contentCompare';

describe('[lib] contentCompare', () => {
  test('compare two string result should [[1, "ds"], [4, "asdf"]].', () => {
    expect(contentCompare('fsdfsdfdas', 'fdsfasdfas')).toEqual([[1, 'ds'], [4, 'asdf']]);
  });
});
