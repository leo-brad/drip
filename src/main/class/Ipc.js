import EventEmitter from 'events';

class Ipc {
  constructor() {
    this.emitter = new EventEmitter();
  }

  send(event, data) {
    const { emitter, } = this;
    emitter.emit(event, data);
  }

  on(event, callback) {
    const { emitter, } = this;
    emitter.on(event, callback);
  }
}

export default Ipc;
