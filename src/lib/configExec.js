import EventEmitter from 'events';
import Instance from '~/class/Instance';
import EventSchedule from '~/class/EventSchedule';

function configExec(config, projectPath) {
  process.chdir(projectPath);
  const emitter = new EventEmitter();
  const priProcs = new Instance(config, emitter).getPriProcs();
  new EventSchedule(priProcs, emitter, config).start();
}

export default configExec;
