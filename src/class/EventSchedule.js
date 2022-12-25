import path from 'path';
import net from 'net';
import os from 'os';
import InstanceCache from '~/class/InstanceCache';
import InstanceIndex from '~/class/InstanceIndex';
import WatchPath from '~/class/WatchPath';
import getPoolSize from '~/lib/getPoolSize';
import ProcPool from '~/class/ProcPool';
import { getPackages, } from '~/lib/package';

class EventSchedule {
  constructor(pps, emitter, config,) {
    this.pool = [];
    this.config = config;
    this.emitter = emitter;
    this.pps = pps;
    // @TODO
    this.ii = new InstanceIndex(1);
    this.ic = new InstanceCache();
    this.size = getPoolSize(config);
    this.wp = new WatchPath(emitter, config);
  }

  start() {
    this.sendPackages();
    this.bindEvent();
    this.wp.start();
    this.fillProcPool();
  }

  writeData(data) {
    //console.log(JSON.stringify(data));
  }

  sendPackages() {
    const packages = getPackages();
    const event = 'package';
    this.writeData([event, packages]);
  }

  fillProcPool(location) {
    this.pp = new ProcPool(this.size);
    const { pps, pp, } = this;
    pps.forEach(({ pri, proc, }) => {
      pp.addPriProc(pri, proc);
    });
    pp.updatePool();
    this.pool = pp.getPool().map((proc) => proc.start());
  }

  cleanProcPool() {
    const { pool, } = this;
    for (let i = 0; i < pool.length; i += 1) {
      pool[i].getProc().kill(2);
    }
  }

  checkFreeMemory() {
    const {
      minMem,
    } = this.config;
    let ans = true;
    if (os.freemem() / 1024 ** 2 > minMem) {
      ans = false;
    }
    return ans;
  }

  bindEvent() {
    const { ic, emitter, } = this;
    emitter.on('file', (eventType, location) => {
      if (
        /^\.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
        .test(path.relative('.', location))
      ) {
        const regexp = /^\.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
        const [_, pkg, instance] = path.relative('.', location).match(regexp);
        const { ii, } = this;
        const record = ii.indexInstance(location);
        ic.cache(pkg, instance, record);
      } else {
        this.cleanProcPool();
        this.fillProcPool(location);
      }
    });
    emitter.on('proc', async ({ field, instance, data='', id, }) => {
      const event = 'proc';
      switch (field) {
        case 'end':
          break;
      }
      this.writeData([event, instance, field, data, id,]);
    });
  }
}

export default EventSchedule;
