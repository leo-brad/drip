import fs from 'fs';
import path from 'path';
import Table from '~/class/Table';
import Serials from '~/class/Serials';
import ContentHash from '~/class/ContentHash';
import * as nonZeroByteArray from '~/lib/nonZeroByteArray';
import * as byteArray from '~/lib/byteArray';
import * as utf8Array from '~/lib/utf8Array';

function getHashTable(serial, i) {
  const hashTable = {};
  serial.forEach((e) => {
    const k= e[i];
    hashTable[k] = true;
  });
  return hashTable;
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
  byteArr = byteArr.concat(utf8Array.fromInt(i2));
  return Buffer.from(byteArr).toString();
}

class InstanceIndex {
  constructor(l) {
    this.m = {};
    this.h = {};
    this.l = l;
    this.ch = new ContentHash();
    this.iiPath = path.join('.drip', 'local', 'ii');
  }

  getName(t, l) {
    switch (t) {
      case 'l':
        return Buffer.from(utf8Array.fromInt(this.getId('l', l))).toString();
      case 'h':
        return Buffer.from(utf8Array.fromInt(this.getId('h', l))).toString();
    }
  }

  getPathNameWithId(type, l, id) {
    if (id === undefined) {
      id = this.getId(type, l);
    }
    return type + getIntStringCouple(l, id);
  }

  indexInstance(location) {
    this.perpare(location);
    const { l, ch, } = this;
    const hashs = [];
    let content = fs.readFileSync(location).toString();
    let hash = content;
    for (let i = 1; i <= l; i += 1) {
      hash = ch.getHash(hash);
      hashs.unshift(hash);
    }
    for (let i = 0; i < hashs.length; i += 1) {
      this.perpareNextLevel(hashs[i], i + 1);
    }
    this.perpareLastLevel(hashs[hashs.length - 1], content);
  }

  perpareNextLevel(c, l) {
    const { pkgPath, m, id, } = this;
    this.perpareSerials(
      'l', this.getName('l', l),
      ['i', 'i'], [BigInt(c.length), this.getId('h', l)], l,
    );
    this.perpareSerials(
      'h', this.getName('h', l),
      ['s', 'i'], [c, this.getId('l', l + 1)], l,
    );
  }

  perpareLastLevel(h, c) {
    const { pkgPath, l, } = this;
    const id = this.incLastId(h);
    const idxPath = path.join(pkgPath, this.getPathNameWithId('c', l + 2, id));
    const totalPath = path.join(idxPath, 't');
    if (!fs.existsSync(idxPath)) {
      fs.mkdirSync(idxPath, { recursive: true, });
      fs.writeFileSync(fs.openSync(totalPath, 'w'), Buffer.from(byteArray.fromInt(0)));
      const idPath = path.join(idxPath, String(0));
      fs.appendFileSync(idPath, c);
    } else {
      const total = byteArray.toInt(fs.readFileSync(totalPath));
      if (iteratorLastId(idxPath, total, c)) {
        const idPath = path.join(idxPath, String(total + 1n));
        fs.appendFileSync(idPath, c);
        fs.writeFileSync(
          fs.openSync(totalPath, 'w'), Buffer.from(byteArray.fromInt(total + 1n))
        );
      }
    }
  }

  incLastId(hash) {
    const { l, h, } = this;
    const name = Buffer.from(utf8Array.fromInt(this.getId('l', l + 2))).toString();
    const serials = this.getSerials('l', l + 2);
    if (!serials.check()) {
      serials.create(['i']);
      serials.add([hash.length]);
    }
    const pn = this.getPathNameWithId('l', l + 2);
    let s;
    if (!h[pn]) {
      s = this.readSerials(serials, 'l', l + 2);
      this.hashSerial(s, pn, 0);
    }
    if (!h[pn][hash.length]) {
      serials.add([hash.length]);
      this.updateSerials(serials, 'l', l + 2)
      s = this.readSerials(serials, 'l', l + 2);
      h[pn][hash.length] = true;
    } else {
      s = serials.read();
      s = this.readSerials(serials, 'l', l + 2);
    }
    return s.findIndex(e => e[0] === hash.length);
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
          pkgPath, 'l' + Buffer.from(utf8Array.fromInt(l)).toString(),
        );
        break;
      case 'h':
        idPath = path.join(
          pkgPath, 'h' + Buffer.from(utf8Array.fromInt(l)).toString(),
        );
        break;
    }
    if (!fs.existsSync(idPath)) {
      const fd = fs.openSync(idPath, 'w');
      const buf = Buffer.from(utf8Array.fromInt(0));
      fs.writeFileSync(fd, buf);
    }
    return idPath;
  }

  getId(type, l) {
    const { pkgPath, } = this;
    const idPath = this.getIdPath(type, l);
    const fd = fs.openSync(idPath, 'r');
    const buf = fs.readFileSync(fd);
    return utf8Array.toInt(buf);
  }

  incId(type, l) {
    const idPath = this.getIdPath(type, l);
    const fd = fs.openSync(idPath, 'r+');
    let id = utf8Array.toInt(fs.readFileSync(fd));
    id += 1n;
    const buf = Buffer.from(utf8Array.fromInt(id));
    fs.writeSync(fd, buf, 0, buf.length, 0);
  }

  getSerials(t, l) {
    const name = this.getName(t, l);
    const { pkgPath, } = this;
    const pn = this.getPathNameWithId(t, l);
    const p = path.join(pkgPath, this.getPathNameWithId(t, l));
    let serials = new Serials(p, name);
    return serials;
  }

  perpareSerials(t, name, type, serial, l) {
    const { pkgPath, m, } = this;
    let serials = this.getSerials(t, l);
    if (!serials.check()) {
      console.log(1);
      this.createSerials(t, l, type, name);
      serials = this.getSerials(t, l);
      this.addSerials(serials, serial, t, l);
    } else {
      serials = this.getSerials(t, l);
      const s = this.readSerials(serials, t, l);
      if (s[0][0] === serial[0]) {
        console.log(2);
        this.addSerials(serials, serial, t, l);
      } else {
        console.log(3);
        this.incId(t, l);
        this.createSerials(t, l, type);
        serials = this.getSerials(t, l);
        this.addSerials(serials, serial, t, l);
      }
    }
  }

  createSerials(t, l, type, name) {
    const { pkgPath, } = this;
    if (name === undefined) {
      name = this.getName(t, l);
    }
    const pn = this.getPathNameWithId(t, l);
    const p = path.join(pkgPath, pn);
    const serials = new Serials(p, name);
    serials.create(type);
  }

  addSerials(serials, serial, t, l) {
    const pn = this.getPathNameWithId(t, l);
    const { h, } = this;
    if (!h[pn]) {
      const s = this.readSerials(serials, t, l);
      this.hashSerial(s, pn, 0);
      this.updateSerials(serials, t, l);
    }
    if (!h[pn][serial[0]]) {
      serials.add(serial);
      this.updateSerials(serials, t, l);
      const newSerial = this.readSerials(serials, t, l);
      this.hashSerial(newSerial, pn, 0);
    }
  }

  updateSerials(serials, t, l) {
    const pn = this.getPathNameWithId(t, l);
    const { m, } = this;
    m[pn] = serials.read();
  }

  readSerials(serials, t, l) {
    const pn = this.getPathNameWithId(t, l);
    const { m, } = this;
    if (m[pn] === undefined) {
      m[pn] = serials.read();
    }
    return m[pn];
  }

  hashSerial(serial, pn, i) {
    const { h, } = this;
    h[pn] = getHashTable(serial, i);
  }
}

export default InstanceIndex;
