import os from 'os';

class PoolSize {
  constructor(config) {
    const {
      core: {
        adjust=0,
      },
    } = config;
    this.adjust = adjust;
  }

  get size() {
    const cpusLength = os.cpus().length;
    const { adjust, } = this;
    const minSize = 2;
    let size;
    if (cpusLength <= minSize) {
      size = minSize + adjust;
    } else {
      size = cpusLength + adjust;
    }
    return size;
  }
}

export default PoolSize;
