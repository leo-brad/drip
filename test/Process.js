new Process('find', ['cinema', '/private/tmp'], '1', '/tmp', 'file').start();

const emitter = new EventEmitter();
new Process('find', ['cinema', '/private/tmp'], '1', '/tmp', 'event', emitter).start();
emitter.on('process', (type, data) => {
  console.log('type', type.toString());
  console.log('data', data.toString());
})
