import { describe, expect, test, } from '@jest/globals';
import Serials from '~/class/Serials';

describe('[class] Serials', () => {
  test('Serials read and write should correct.', () => {
    const serials = new Serials('/tmp/test/', 'test');
    serials.create(['s', 'i']);
    serials.addOne(['fhfsff', 1143]);
    serials.addOne(['fsfsfs', 42342]);
    expect(serials.readAll()).toEqual([["fhfsff", 1143n], ["fsfsfs", 42342n]]);
    serials.addAll([['fasdfasdfs', 423423], ['fasdfas', 43243]]);
  });
});

