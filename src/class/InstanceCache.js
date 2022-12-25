class InstanceCache {
  constructor() {
    this.c = {};
  }

  cache(pkg, instance, record) {
    const { c, } = this;
    if (c[pkg] === undefined) {
      c[pkg] = {};
    }
    c[pkg][instance] = record;
  }

  clear(pkg, instance) {
    const { c, } = this;
    delete c[pkg][instance];
  }

  getRecord(pkg, instance) {
    const { c, } = this;
    return c[pkg][instance];
  }
}

export default InstanceCache;
