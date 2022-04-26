import path from 'path';
import fs from 'fs';
import * as nonZeroByteArray from '~/lib/nonZeroByteArray';
import * as byteArray from '~/lib/byteArray';

function parseSerial(t, e, serial) {
  switch (t) {
    case 'i':
      serial.push(nonZeroByteArray.toInt(e));
      break;
    case 's':
      serial.push(e.toString());
      break;
  }
}

class Serials {
  constructor(p, n) {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true, });
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

  readAll() {
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
      parseSerial(type[p], segments[i], serial);
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

  readOne() {
    this.initType();
    this.initPosition();
    const { typePath, serialsPath, type, position, } = this;
    const buf = fs.readFileSync(serialsPath);
    const segments = [];
    let s = position;
    let serial
    if (position < buf.length) {
      for (let i = position; i < buf.length; i += 1) {
        if (buf[i] === 0) {
          segments.push(buf.slice(s, i));
          s = i + 1;
        }
        if (segments.length === type.length) {
          this.position = i + 1;
          break;
        }
      }
      let p = 0;
      serial = [];
      for (let i = 0; i < segments.length; i += 1) {
        parseSerial(type[p], segments[i], serial);
        p += 1;
      }
    } else {
      serial = undefined;
    }
    return serial;
  }

  initPosition() {
    if (this.position === undefined) {
      this.position = 0;
    }
  }

  serialOne(serial, total) {
    const pbytes = [];
    const { serialsPath, type, } = this;
    for (let i = 0; i < serial.length; i += 1) {
      switch (type[i]) {
        case 'i':
          pbytes.push(Array.from(nonZeroByteArray.fromInt(serial[i])));
          break;
        case 's':
          pbytes.push(Array.from(Buffer.from(serial[i])));
          break;
      }
      pbytes.push(0);
    }
    return pbytes;
  }

  addOne(serial) {
    this.initType();
    const { serialsPath, type, } = this;
    const total = fs.lstatSync(serialsPath).size;
    const pbytes = this.serialOne(serial, total);
    const buf = Buffer.from(pbytes.flat());
    const { length, path, name, } = this;
    const fd = fs.openSync(serialsPath, 'a');
    fs.writeSync(fd, buf, 0, buf.length, total);
  }

  addAll(serials) {
    this.initType();
    const { serialsPath, type, } = this;
    const pbytes = [];
    const total = fs.lstatSync(serialsPath).size;
    serials.forEach((serial) => {
      const total = fs.lstatSync(serialsPath).size;
      pbytes.push(this.serialOne(serial, total));
    });
    const buf = Buffer.from(pbytes.flat(2));
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
