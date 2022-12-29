import ProcPool from '~/class/ProcPool';

describe('[class] ProcPool', () => {
  test('ProcPool exec result should correct.', () => {
    const pp = new ProcPool(8);

    const p1 = { id: 42, };
    const p2 = { id: 58, };
    const p3 = { id: 85, };
    const p4 = { id: 38, };
    const p5 = { id: 48, };
    const p6 = { id: 19, };
    const p7 = { id: 29, };
    const p8 = { id: 58, };
    const p9 = { id: 38, };
    const p10 = { id: 68, };
    const p11 = { id: 39, };
    const p12 = { id: 59, };
    const p13 = { id: 39, };
    const p14 = { id: 95, };
    const p15 = { id: 39, };

    pp.addPriProc(42, p1);
    pp.addPriProc(58, p2);
    pp.addPriProc(85, p3);
    pp.addPriProc(38, p4);
    pp.addPriProc(48, p5);
    pp.addPriProc(19, p6);
    pp.addPriProc(29, p7);
    pp.addPriProc(58, p8);
    pp.addPriProc(38, p9);
    pp.addPriProc(68, p10);
    pp.addPriProc(39, p11);
    pp.addPriProc(59, p12);
    pp.addPriProc(39, p13);
    pp.addPriProc(95, p14);
    pp.addPriProc(39, p15);

    pp.updatePool();
    pp.getPool();

    pp.removeProc(p4);
    pp.removeProc(p3);
    pp.updatePool();

    expect(pp.getDiff()).toEqual([{"id": 95}, {"id": 85}, {"id": 68}, {"id": 59}, {"id": 58}, {"id": 58}, {"id": 48}, {"id": 42}, {"id": 39}]);
    expect(pp.getPool()).toEqual([{"id": 95}, {"id": 68}, {"id": 59}, {"id": 58}, {"id": 58}, {"id": 48}, {"id": 42}, {"id": 39}]);

    pp.removeProc(p10);
    pp.removeProc(p12);
    pp.updatePool();

    expect(pp.getDiff()).toEqual([{"id": 95}, {"id": 85}, {"id": 68}, {"id": 59}, {"id": 58}, {"id": 58}, {"id": 48}, {"id": 42}, {"id": 39}, {"id": 39}, {"id": 39}]);
    expect(pp.getPool()).toEqual([{"id": 95}, {"id": 58}, {"id": 58}, {"id": 48}, {"id": 42}, {"id": 39}, {"id": 39}, {"id": 39}]);
  });
});
