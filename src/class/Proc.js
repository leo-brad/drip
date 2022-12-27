import { spawn, } from 'child_process';
import net from 'net';
import fs from 'fs';
import path from 'path';

class Proc {
  constructor({ command, args, instance, pattern, directory, emitter, socket, }) {
    this.command = command;
    this.args = args;
    this.pattern = pattern;
    this.instance = instance;
    this.stdoutId = 0;
    this.stderrId = 0;
    this.messageId = 0;
    if (pattern.includes('file')) {
      this.procPath = path.join(directory, instance);
      this.directory = directory;
    }
    if (pattern.includes('event')) {
      this.emitter = emitter;
    }
    if (pattern.includes('socket')) {
      this.socket = socket;
    }
    this.proc = null;
  }

  getProc() {
    return this.proc;
  }

  outputStdout(data) {
    const { pattern, stdoutId, } = this;
    if (pattern.includes('event')) {
      const { instance, emitter, } = this;
      emitter.emit('proc', { field: 'stdout', instance, data, });
    }
    if (pattern.includes('file')) {
      this.stdoutId += 1;
      const { procPath, } = this;
      const filePath = path.join(procPath, 'stdout', stdoutId.toString());
      fs.appendFile(filePath, data, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    if (pattern.includes('socket')) {
      const { socket, } = this;
      socket.write(JSON.stringify({
        event: 'proc',
        field: 'stdout',
        data,
      }));
    }
  }

  outputStderr(data) {
    const { pattern, stderrId, } = this;
    if (pattern.includes('event')) {
      const { instance, emitter, } = this;
      emitter.emit('proc', { field: 'stderr', instance, data, });
    }
    if (pattern.includes('file')) {
      this.stderrId += 1;
      const { procPath, } = this;
      const filePath = path.join(procPath, 'stderr', stderrId.toString());
      fs.appendFile(filePath, data, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    if (pattern.includes('socket')) {
      const { socket, } = this;
      socket.write(JSON.stringify({
        event: 'proc',
        field: 'stderr',
        data,
      }));
    }
  }

  outputCode(code) {
    const { pattern, } = this;
    if (pattern.includes('event')) {
      const { instance, emitter, } = this;
      emitter.emit('proc', { field: 'close', instance, code, });
    }
    if (pattern.includes('file')) {
      const { procPath, } = this;
      const filePath = path.join(procPath, 'code');
      fs.appendFile(filePath, code.toString(), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    if (pattern.includes('socket')) {
      const { socket, } = this;
      socket.write(JSON.stringify({
        event: 'proc',
        field: 'close',
        data: code,
      }));
    }
  }

  outputMessage(message) {
    const { pattern, } = this;
    if (pattern.includes('event')) {
      const { instance, emitter, } = this;
      emitter.emit('proc', { field: 'message', instance, message, });
    }
    if (pattern.includes('file')) {
      this.messageId += 1;
      const { procPath, } = this;
      const filePath = path.join(procPath, 'message', messageId.toString());
      fs.appendFile(filePath, data, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    if (pattern.includes('socket')) {
      const { socket, } = this;
      socket.write(JSON.stringify({
        event: 'proc',
        field: 'message',
        data: message,
      }));
    }
  }

  outputNew() {
    const { pattern, } = this;
    if (pattern.includes('event')) {
      const { instance, emitter, } = this;
      emitter.emit('proc', { field: 'new', instance, });
    }
    if (pattern.includes('file')) {
      this.makeProcDirectory();
    }
    if (pattern.includes('socket')) {
      const { socket, } = this;
      socket.write(JSON.stringify({
        event: 'proc',
        field: 'new',
        data: { instance, },
      }));
    }
  }

  start() {
    const { command, args, } = this;
    const proc = spawn(command, args);
    this.outputNew();
    proc.stdout.on('data', (data) => {
      this.outputStdout(data.toString());
    });
    proc.stderr.on('data', (data) => {
      this.outputStderr(data.toString());
    });
    proc.on('close', (code) => {
      this.outputCode(code);
    });
    proc.on('message', (message) => {
      this.outputMessage(message.toString());
    });
    this.proc = proc;
    return this;
  }

  makeProcDirectory() {
    const { procPath, } = this;
    if (!fs.existsSync(procPath)) {
      fs.mkdirSync(procPath);
      const stdoutPath = path.join(procPath, 'stdout');
      if (!fs.existsSync(stdoutPath)) {
        fs.mkdirSync(stdoutPath);
      }
      const stderrPath = path.join(procPath, 'stderr');
      if (!fs.existsSync(stderrPath)) {
        fs.mkdirSync(stderrPath);
      }
    } else {
    }
  }

  removeProcDirectory() {
    const { procPath, } = this;
    if (fs.existsSync(procPath)) {
      fs.rmdirSync(procPath);
    }
  }
}

export default Proc;
