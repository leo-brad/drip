const emitter = new EventEmitter();
const priProcs = [
  { pri: 1, proc: new Proc({ command: 'echo', args: ['1'], name: '1', pattern: 'event', emitter, }), },
  { pri: 2, proc: new Proc({ command: 'echo', args: ['2'], name: '2', pattern: 'event', emitter, }), },
  { pri: 3, proc: new Proc({ command: 'echo', args: ['3'], name: '3', pattern: 'event', emitter, }), },
];
const c = JSON.parse(config);
new EventSchedule({
  emitter,
  priProcs,
  projectPath,
  size: parseInt(c.core.adjust) + os.cpus().length,
  ignores: c.core.ignores,
}).start();
