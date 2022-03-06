import EventEmitter from 'events';
import Instance from '~/class/Instance';
import EventSchedule from '~/class/EventSchedule';

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
