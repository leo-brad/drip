import EventEmitter from 'events';
import Instance from '~/class/Instance';
import EventSchedule from '~/class/EventSchedule';

const [_1, _2, configString, projectPath] = process.argv;
const config = JSON.parse(configString);
process.chdir(projectPath);
const emitter = new EventEmitter();
const priProcs = new Instance(config, emitter).getPriProcs();
new EventSchedule(priProcs, emitter, config).start();
