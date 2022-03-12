import path from 'path';
import fs from 'fs';
import nonZeroByteArray from '~/lib/nonZeroByteArray';
import byteArray from '~/lib/byteArray';

class Serials {
  constructor(p, n) {
    this.serialsPath = path.join(p, n);
    this.typePath = path.join(p, n + '-t');
  }

  initType() {
    const { type, typePath, } = this;
    if (type === undefined) {
      this.type = JSON.parse(fs.readFileSync(typePath));
    }
  }

  create(type) {
    const { typePath, serialsPath, } = this;
    fs.appendFileSync(typePath, JSON.stringify(type));
    fs.openSync(serialsPath, 'a');
  }

  read() {
    this.initType();
    const { typePath, serialsPath, } = this;
    const buf = fs.readFileSync(typePath);
    const segments = [];
    let s = 0;
    for (let i = 0; i < buf.length; i += 1) {
      if (buf[i] === 0) {
        segments.push(buf.slice(s, i));
        s = i + 1;
      }
    }
    segments.push(buf.slice(s, i));
    const { length, } = type;
    const serial = [];
    let p = 0;
    for (let i = 0; i < segments.length; i += 1) {
      const t = type[p];
      const e = segments[i];
      switch (t) {
        case 'i':
          serial.push(nonZeroByteArray.toInt(e));
          break;
        case 's':
          serial.push(e.toString());
          break;
      }
      if (p === length) {
        p = 0;
      }
    }
    return serial;
  }

  add(serial) {
    this.initType();
    const { serialsPath, type, } = this;
    const bytes = [];
    for (let i = 0; i < serial.length; i += 1) {
      bytes.push(serial[i]);
      if (i !== serial.length) {
        bytes.push(0);
      }
    }
    const buf = Buffer.from(bytes.flat());
    const total = fs.fstatSync(serialsPath).size;
    const { length, path, name, } = this;
    const fd = fs.openSync(serialsPath, 'a');
    fs.writeSync(fd, buf, 0, buf.length, total);
  }
}

export default Serials;
