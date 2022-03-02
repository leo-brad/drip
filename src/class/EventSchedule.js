import path from 'path';
import net from 'net';
import WatchPath from '~/class/WatchPath';
import PoolSize from '~/class/PoolSize';
import ProcPool from '~/class/ProcPool';
import HashFile from '~/class/HashFile';
import { getPlugins, } from '~/lib/plugin';

class EventSchedule {
  constructor({ priProcs=[], emitter=null, config={}, pattern='cmd' }) {
    this.pool = [];
    this.pattern = pattern;
    this.emitter = emitter;
    this.priProcs = priProcs;
    //this.hf = new HashFile({});
    this.size = new PoolSize(config).size;
    this.watchPath = new WatchPath({ emitter, config, });
  }

  start() {
    const { pattern, } = this;
    switch (pattern) {
      case 'cmd':
        this.schedule();
        break;
      case 'gui':
        this.initSocket();
        break;
    }
  }

  schedule() {
    this.sendPlugins();
    this.bindEvent();
    this.watchPath.start();
    this.fillProcPool();
  }

  writeData(data) {
    const { socket, pattern, } = this;
    if (pattern === 'gui') {
      socket.write(JSON.stringify(data));
    }
  }

  initSocket() {
    const server = net.createServer((socket) => {
      this.socket = socket;
      this.schedule();
    });
    server.listen(3000);
  }

  sendPlugins() {
    const plugins = getPlugins();
    const event = 'plugin';
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

  bindEvent() {
    const { emitter, socket, } = this;
    emitter.on('file', (eventType, location) => {
      if (
        /^\/.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
        .test(path.resolve(location))
      ) {
        //const { hf, } = this;
        //hf.indexFile(location);
      } else {
        this.cleanProcPool();
        this.fillProcPool(location);
      }
    });
    emitter.on('proc', async ({ field, instance, data='', id, }) => {
      const event = 'proc';
      this.writeData([event, instance, field, data, id,]);
    });
  }
}

export default EventSchedule;
