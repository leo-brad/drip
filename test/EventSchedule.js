const emitter = new EventEmitter();
const priProcs = [
  { pri: 1, proc: new Proc({ command: 'echo', args: ['1'], name: '1', pattern: 'event', emitter, }), },
  { pri: 2, proc: new Proc({ command: 'echo', args: ['2'], name: '2', pattern: 'event', emitter, }), },
  { pri: 3, proc: new Proc({ command: 'echo', args: ['3'], name: '3', pattern: 'event', emitter, }), },
];
const eventSchedule = new EventSchedule(priProcs, '/private/tmp/test/', [], 8, emitter);
eventSchedule.start();
