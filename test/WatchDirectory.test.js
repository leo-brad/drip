const ignores = [
  'test',
];
const emitter = new EventEmiiter();

const watchDirectory = new WatchDirectory('/private/tmp/test', ignores, emitter, '/private/tmp/test');
watchDirectory.start();

emitter.on('file', (event, location) => {
  console.log('event', event);
  console.log('location', location);
});
