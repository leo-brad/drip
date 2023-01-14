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
    if (pattern.includes('file')) {
      this.stdoutId = 0;
      this.stderrId = 0;
      this.messageId = 0;
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

  writeData(data) {
    const { pattern, } = this;
    if (pattern.includes('event')) {
      const { emitter, } = this;
      emitter.emit(data);
    }
    if (pattern.includes('socket')) {
      const { socket, } = this;
      socket.write(JSON.stringify(data), 'utf-8');
    }
  }

  outputStdout(data) {
    const { instance, } = this;
    this.writeData(['proc', instance, 'stdout', data,]);

    const { pattern, } = this;
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
  }

  outputStderr(data) {
    const { instance, } = this;
    this.writeData(['proc', instance, 'stderr', data,]);

    const { pattern, } = this;
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
  }

  outputCode(code) {
    const { instance, } = this;
    this.writeData(['proc', instance, 'close', code]);

    const { pattern, } = this;
    if (pattern.includes('file')) {
      const { procPath, } = this;
      const filePath = path.join(procPath, 'code');
      fs.appendFile(filePath, code.toString(), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }

  outputMessage(message) {
    const { instance, } = this;
    this.writeData(['proc', instance, 'message', message,]);

    const { pattern, } = this;
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
  }

  outputNew() {
    const { instance, } = this;
    this.writeData(['proc', instance, 'new']);

    const { pattern, } = this;
    if (pattern.includes('file')) {
      this.makeProcDirectory();
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
      this.outputMessage(message);
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
