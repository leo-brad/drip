import path from 'path';
import net from 'net';
import os from 'os';
import InstanceIndex from '~/class/InstanceIndex';
import WatchPath from '~/class/WatchPath';
import PoolSize from '~/class/PoolSize';
import ProcPool from '~/class/ProcPool';
import { getPackages, } from '~/lib/package';

class EventSchedule {
  constructor({ priProcs=[], emitter=null, config={}, }) {
    this.pool = [];
    this.config = config;
    this.emitter = emitter;
    this.priProcs = priProcs;
    this.ii = new InstanceIndex(2);
    this.size = new PoolSize(config).size;
    this.watchPath = new WatchPath(emitter, config);
  }

  start() {
    this.sendPackages();
    this.bindEvent();
    this.watchPath.start();
    this.fillProcPool();
  }

  writeData(data) {
    //console.log(JSON.stringify(data));
  }

  initSocket() {
    const server = net.createServer((socket) => {
      this.socket = socket;
      this.schedule();
    });
    server.listen(3000);
  }

  sendPackages() {
    const plugins = getPackages();
    const event = 'package';
    this.writeData([event, plugins]);
  }

  fillProcPool(location) {
    this.procPool = new ProcPool(this.size);
    const { priProcs, procPool, } = this;
    priProcs.forEach(({ pri, proc, }) => {
      procPool.addPriProc(pri, proc);
    });
    procPool.updatePool();
    this.pool = procPool.getPool().map((proc) => {
      proc.start();
      return proc;
    });
  }

  cleanProcPool() {
    const { pool, } = this;
    for (let i = 0; i < pool.length; i += 1) {
      pool[i].getProc().kill(2);
    }
  }

  checkFreeMemory() {
    const {
      core: {
        minMem,
      },
    } = this.config;
    let ans = true;
    if (os.freemem() / 1024 ** 2 > minMem) {
      ans = false;
    }
    return ans;
  }

  bindEvent() {
    const { emitter, socket, } = this;
    emitter.on('file', (eventType, location) => {
      if (
        /^\.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
        .test(path.relative('.', location))
      ) {
        const { ii, } = this;
        ii.indexInstance(location);
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
