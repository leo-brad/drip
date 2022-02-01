import net from 'net';

class ReceiveData {
  constructor() {
    this.socket = net.connect({ port: 3000, });
    this.buffer = [];
  }

  start() {
    this.handleData();
    setInterval(() => {
      console.log(this.buffer[this.buffer.length - 1]);
    }, 500);
  }

  handleData() {
    const { socket, buffer, } = this;
    socket.on('data', (data) => {
      buffer.push(data.toString());
    });
  }
}

export default ReceiveData;
