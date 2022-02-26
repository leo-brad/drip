import net from 'net';

class ReceiveData {
  constructor({ ipc=null, }) {
    this.ipc = ipc;
    this.buffers = [];
    this.register = {};
  }

  connect() {
    this.socket = net.connect({
      port: 3000,
    });
    this.handleData();
  }

  start() {
    this.connect();
    const { buffers, register, ipc, } = this;
    setInterval(() => {
      while (buffers.length) {
        const buffer = this.buffers.shift();
        ipc.send('drip', buffer.toString());
      }
    }, 500);
  }

  handleData() {
    const { socket, buffers, } = this;
    socket.on('data', (data) => {
      buffers.push(data);
    });
  }
}

export default ReceiveData;
