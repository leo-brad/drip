import PriProcBucket from '~/class/PriProcBucket';

describe('[class] PriProcBucket', () => {
  test('PriProcBucket output proc order should correct.', () => {
    const ppb = new PriProcBucket(100, 10);
    ppb.addPriProc(53, { id: 53 });
    ppb.addPriProc(42, { id: 42 });
    ppb.addPriProc(54, { id: 54 });
    ppb.addPriProc(20, { id: 20 });

    expect(ppb.highestProc).toEqual({"id": 54});
    expect(ppb.highestProc).toEqual({"id": 53});
    expect(ppb.highestProc).toEqual({"id": 42});
    expect(ppb.highestProc).toEqual({"id": 20});
  });
});
