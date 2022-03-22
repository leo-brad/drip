import path from 'path';
import fs from 'fs';
import * as nonZeroByteArray from '~/lib/nonZeroByteArray';
import * as byteArray from '~/lib/byteArray';

class Serials {
  constructor(p, n) {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
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
    fs.writeFileSync(fs.openSync(typePath, 'w'), JSON.stringify(type));
    fs.openSync(serialsPath, 'w');
  }

  read() {
    this.initType();
    const { typePath, serialsPath, type, } = this;
    const buf = fs.readFileSync(serialsPath);
    const segments = [];
    let s = 0;
    for (let i = 0; i < buf.length; i += 1) {
      if (buf[i] === 0) {
        segments.push(buf.slice(s, i));
        s = i + 1;
      }
    }
    segments.push(buf.slice(s, buf.length));
    const serials = [];
    let serial = [];
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
      if (p === type.length - 1) {
        serials.push(serial);
        serial = [];
        p = 0;
      } else {
        p += 1;
      }
    }
    return serials;
  }

  add(serial) {
    this.initType();
    const { serialsPath, type, } = this;
    const pbytes = [];
    for (let i = 0; i < serial.length; i += 1) {
      switch (type[i]) {
        case 'i':
          pbytes.push(Array.from(nonZeroByteArray.fromInt(serial[i])));
          break;
        case 's':
          pbytes.push(Array.from(Buffer.from(serial[i])));
          break;
      }
      if (i !== serial.length - 1) {
        pbytes.push(0);
      }
    }
    const total = fs.lstatSync(serialsPath).size;
    if (total !== 0) {
      pbytes.unshift(0);
    }
    const buf = Buffer.from(pbytes.flat());
    const { length, path, name, } = this;
    const fd = fs.openSync(serialsPath, 'a');
    fs.writeSync(fd, buf, 0, buf.length, total);
  }

  check() {
    const { serialsPath, typePath, } = this;
    let ans = true;
    if (!fs.existsSync(serialsPath)) {
      ans = false;
    }
    if (!fs.existsSync(typePath)) {
      ans = false;
    }
    return ans;
  }
}

export default Serials;
