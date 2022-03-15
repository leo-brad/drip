import fs from 'fs';
import path from 'path';
import Table from '~/class/Table';
import Serials from '~/class/Serials';
import ContentHash from '~/class/ContentHash';
import * as nonZeroByteArray from '~/lib/nonZeroByteArray';
import * as byteArray from '~/lib/byteArray';
import * as utf8Array from '~/lib/utf8Array';

function getSet(serial) {
  const set = new Set();
  serial.forEach((e) => {
    const [k] = e;
    set.add(k);
  });
  return set;
}

function iteratorLastId(idxPath, total, c) {
  let ans = true;
  for (let i = 0; i <= total; i += 1) {
    const idPath = path.join(idxPath, String(i));
    if (c === fs.readFileSync(idPath).toString()) {
      ans = false;
      break;
    }
  }
  return ans;
}

function getIntStringCouple(i1, i2) {
  let byteArr = utf8Array.fromInt(i1);
  byteArr.push(32);
  byteArr.concat(utf8Array.fromInt(i2));
  return Buffer.from(byteArr).toString();
}

function getPathNameWithId(type, l, id) {
  return type + getIntStringCouple(l, id);
}

class InstanceIndex {
  constructor(l) {
    this.m = {};
    this.h = {};
    this.l = l;
    this.ch = new ContentHash({});
    this.iiPath = path.join('.drip', 'local', 'ii');
  }

  indexInstance(location) {
    this.perpare(location);
    const { l, ch, } = this;
    const hashs = [];
    let content = fs.readFileSync(location).toString();
    for (let i = 1; i <= l; i += 1) {
      content = ch.getHash(content);
      hashs.unshift(content);
    }
    for (let i = 0; i < hashs.length; i += 1) {
      this.perpareNextLevel(hashs[i], i + 1);
    }
    this.perpareLastLevel(content);
  }

  perpareNextLevel(c, l) {
    const { pkgPath, m, id, } = this;
    this.perpareSerials(
      'l', Buffer.from(utf8Array.fromInt(this.getId('l', l))).toString(),
      ['i', 'i'], [c.length, this.getId('h', l)], l,
    );
    this.perpareSerials(
      'h', Buffer.from(utf8Array.fromInt(this.getId('h', l))).toString(),
      ['h', 'i'], [c, this.getId('h', l + 1)], l,
    );
  }

  perpareLastLevel(c) {
    const { pkgPath, l, } = this;
    const idxPath = path.join(
      pkgPath, getPathNameWithId('h', l + 1, this.getId('l', l + 1))
    );
    const totalPath = path.join(idxPath, 't');
    if (!fs.existsSync(idxPath)) {
      fs.mkdirSync(idxPath, { recursive: true, });
      fs.appendFileSync(totalPath, Buffer.from(byteArray.fromInt(0)));
      const idPath = path.join(idxPath, String(0));
      fs.appendFileSync(idPath, c);
    } else {
      const total = toInt(fs.readFileSync(totalPath));
      if (iteratorLastId(idxPath, total, c)) {
        const idPath = path.join(idxPath, String(total + 1));
        fs.appendFileSync(idPath, c);
        fs.writeFileSync(fs.openSync(totalPath, 'w'), Buffer.from(fromInt(total + 1)));
      }
    }
  }

  perpare(location) {
    const { iiPath, } = this;
    const [_, pkg] = path.relative('.', location).match(
      /^\.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
    );
    const pkgPath = path.join(iiPath, pkg);
    if (!fs.existsSync(pkgPath)) {
      fs.mkdirSync(pkgPath);
    }
    this.pkgPath = pkgPath;
  }

  getIdPath(type, l) {
    const { pkgPath, } = this;
    let idPath;
    switch (type) {
      case 'l':
        idPath = path.join(
          pkgPath, 'l' + Buffer.from(utf8Array.fromInt(l + 1)).toString(),
        );
        break;
      case 'h':
        idPath = path.join(
          pkgPath, 'h' + Buffer.from(utf8Array.fromInt(l + 1)).toString(),
        );
        break;
    }
    return idPath;
  }

  getId(type, l) {
    const { pkgPath, } = this;
    const idPath = this.getIdPath(type, l);
    let id;
    if (!fs.existsSync(idPath)) {
      const fd = fs.openSync(idPath, 'w');
      const buf = Buffer.from(utf8Array.fromInt(32));
      fs.writeFileSync(fd, buf);
      id = 0;
    } else {
      const fd = fs.openSync(idPath, 'r');
      id = utf8Array.toInt(fs.readFileSync(fd));
    }
    return id;
  }

  incId(type, l) {
    const idPath = this.getIdPath(type, l);
    const fd = fs.openSync(idPath, 'r+');
    let id = utf8Array.toInt(fs.readFileSync(fd));
    id += 1;
    fs.writeFileSync(fd, Buffer.from(utf8Array.fromInt(id)));
  }

  perpareSerials(t, name, type, serial, l) {
    const { pkgPath, m, } = this;
    let p = path.join(pkgPath, getPathNameWithId(t, l, this.getId(t, l)));
    let serials = new Serials(p, name);
    if (!serials.check()) {
      this.incId(t, l);
      p = path.join(pkgPath, getPathNameWithId(t, l, this.getId(t, l)));
      serials = new Serials(p, name);
      serials.create(type);
    }
    this.updateSerials(serials, serial, name);
  }

  updateSerials(serials, serial, name ) {
    const { h, } = this;
    if (!h[name] || (h[name] && !h[name].has(serial))) {
      serials.add(serial);
      const newSerial = serials.read();
      this.hashSerial(newSerial, name);
      this.memSerial(newSerial, name);
    }
  }

  memSerial(serial, name) {
    const { m, } = this;
    if (m[name] === undefined) {
      m[name] = serial;
    }
    return m[name];
  }

  hashSerial(serial, name) {
    const { h, } = this;
    if (h[name] === undefined) {
      h[name] = getSet(serial);
    }
  }
}

export default InstanceIndex;
