import { app, BrowserWindow, } from 'electron';
import { execSync, } from 'child_process';
import EventEmitter from 'events';
import path from 'path';
import os from 'os';
import EventSchedule from '~/class/EventSchedule';
import Instance from '~/class/Instance';
import PoolSize from '~/class/PoolSize';

class ConfigExec {
  constructor({ config, projectPath, }) {
    this.config = config;
    this.emitter = new EventEmitter();
    process.chdir(projectPath);
  }

  start() {
    const { emitter, config, projectPath, } = this;
    const priProcs = new Instance(config, emitter).getPriProcs();
    new EventSchedule({ emitter, config, priProcs, }).start();
  }
}

export default ConfigExec;
