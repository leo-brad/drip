import { app, BrowserWindow, } from 'electron';
import { execSync, } from 'child_process';
import EventEmitter from 'events';
import path from 'path';
import os from 'os';
import ReceiveData from '~/main/class/ReceiveData';
import EventSchedule from '~/main/class/EventSchedule';
import Instance from '~/main/class/Instance';
import PoolSize from '~/main/class/PoolSize';

class ConfigExec {
  constructor({ config, projectPath, pattern='gui', }) {
    this.config = config;
    this.pattern = pattern;
    this.projectPath = projectPath;
    this.emitter = new EventEmitter();
    this.changeDir();
  }

  changeDir() {
    const { projectPath, } = this;
    if (projectPath !== undefined) {
      process.chdir(projectPath);
    }
  }

  start() {
    const { emitter, config, projectPath, pattern, } = this;
    const priProcs = new Instance(config, emitter).getPriProcs();
    new EventSchedule({ emitter, config, priProcs, pattern }).start();
  }
}

export default ConfigExec;
