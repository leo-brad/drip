import PriProcBucket from '~/class/PriProcBucket';

class ProcPool {
  constructor(size) {
    this.size = size;
    this.pool = [];
    this.diff = [];
    this.waits = new PriProcBucket(100, 10);
  }

  getPool() {
    return this.pool;
  }

  getDiff() {
    return this.diff;
  }

  updatePool() {
    const { waits, diff, pool, size, } = this;
    while (pool.length < size && waits.count > 0) {
      const proc = waits.highestProc;
      pool.push(proc);
      diff.push(proc);
    }
  }

  addPriProc(pri, proc) {
    this.waits.addPriProc(pri, proc);
  }

  removeProc(proc) {
    const { pool, } = this;
    for (let i = 0; i < pool.length; i += 1) {
      if (pool[i] === proc) {
        pool.splice(i, 1);
        break;
      }
    }
  }
}

export default ProcPool;
