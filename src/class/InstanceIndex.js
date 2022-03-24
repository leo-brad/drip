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
    const idPath = path.join(idxPath, 'c' + Buffer.from(utf8Array.fromInt(i)).toString());
    if (c === fs.readFileSync(idPath).toString()) {
      ans = false;
      break;
    }
  }
  return ans;
}

function getIdsPath(ids) {
  let p = '';
  for (let i = 0; i < ids.length; i += 1) {
    p = path.join(p, 'p' + Buffer.from(utf8Array.fromInt(ids[i])).toString());
  }
  return p;
}

class InstanceIndex {
  constructor(l) {
    this.h = {};
    this.l = l;
    this.ch = new ContentHash();
    this.iiPath = path.join('.drip', 'local', 'ii');
  }

  getName(t, l, ids) {
    return t + Buffer.from(utf8Array.fromInt(this.getId(t, l, ids))).toString();
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
    const ids = [];
    for (let i = 0; i < hashs.length; i += 1) {
      this.perpareNextLevel(hashs[i], i + 1, ids);
    }
    this.perpareLastLevel(hashs[hashs.length - 1], content, ids);
  }

  perpareNextLevel(c, l, ids) {
    const { pkgPath, m, id, } = this;
    this.perpareSerials(
      'l', this.getName('l', l, ids),
      ['i', 'i'], [BigInt(c.length), this.getId('h', l, ids)], l, ids,
    );
    ids.push(this.getId('h', l, ids));
    this.perpareSerials(
      'h', this.getName('h', l, ids),
      ['s', 'i'], [c, this.getId('l', l + 1, ids)], l, ids,
    );
    ids.push(this.getId('l', l + 1, ids));
  }

  perpareLastLevel(h, c, ids) {
    const { pkgPath, l, } = this;
    const id = this.incLastId(h, ids);
    const idxPath = path.join(pkgPath, getIdsPath(ids));
    const totalPath = path.join(idxPath, 'i');
    if (!fs.existsSync(idxPath)) {
      const idBuf = 'c' + Buffer.from(utf8Array.fromInt(0));
      fs.mkdirSync(idxPath, { recursive: true, });
      fs.writeFileSync(fs.openSync(totalPath, 'w'), idBuf);
      const idPath = path.join(idxPath, idBuf.toString());
      fs.appendFileSync(idPath, c);
    } else {
      const total = utf8Array.toInt(fs.readFileSync(totalPath));
      const idBuf = 'c' + Buffer.from(utf8Array.fromInt(total + 1n));
      if (iteratorLastId(idxPath, total, c)) {
        const idPath = path.join(idxPath, idBuf.toString());
        fs.appendFileSync(idPath, c);
        fs.writeFileSync(fs.openSync(totalPath, 'w'), idBuf);
      }
    }
  }

  incLastId(hash, ids) {
    const { l, h, } = this;
    const name = Buffer.from(utf8Array.fromInt(this.getId('l', l + 2, ids))).toString();
    const serials = this.getSerials('l', l + 2, ids);
    if (!serials.check()) {
      serials.create(['i']);
      serials.add([hash.length]);
    }
    const ip = getIdsPath(ids);
    let s;
    if (!h[ip]) {
      s = serials.read();
      this.hashSerial(s, ip, 0);
    }
    if (!h[ip][hash.length]) {
      serials.add([hash.length]);
      s = serials.read();
      h[ip][hash.length] = true;
    } else {
      s = serials.read();
    }
    ids.push(this.getId('l', l + 2, ids));
    return s.findIndex(e => e[0] === BigInt(hash.length));
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

  getIdPath(ids) {
    const { pkgPath, } = this;
    const idsPath = path.join(pkgPath, getIdsPath(ids));
    if (!fs.existsSync(idsPath)) {
      fs.mkdirSync(idsPath, { recursive: true, });
    }
    const idPath = path.join(idsPath, 'i');
    if (!fs.existsSync(idPath)) {
      const fd = fs.openSync(idPath, 'w');
      const buf = Buffer.from(utf8Array.fromInt(1));
      fs.writeFileSync(fd, buf);
    }
    return idPath;
  }

  getId(type, l, ids) {
    const { pkgPath, } = this;
    const idPath = this.getIdPath(ids);
    const fd = fs.openSync(idPath, 'r');
    const buf = fs.readFileSync(fd);
    return utf8Array.toInt(buf);
  }

  incId(type, l, ids) {
    const idPath = this.getIdPath(ids);
    const fd = fs.openSync(idPath, 'r+');
    let id = utf8Array.toInt(fs.readFileSync(fd));
    id += 1n;
    const buf = Buffer.from(utf8Array.fromInt(id));
    fs.writeSync(fd, buf, 0, buf.length, 0);
  }

  getSerials(t, l, ids) {
    const name = this.getName(t, l, ids);
    const { pkgPath, } = this;
    const ip = getIdsPath(ids);
    const p = path.join(pkgPath, getIdsPath(ids));
    let serials = new Serials(p, name);
    return serials;
  }

  perpareSerials(t, name, type, serial, l, ids) {
    const { pkgPath, m, } = this;
    let serials = this.getSerials(t, l, ids);
    if (!serials.check()) {
      this.createSerials(t, l, type, ids, name);
      serials = this.getSerials(t, l, ids);
      this.addSerials(serials, serial, t, l, ids);
    } else {
      serials = this.getSerials(t, l, ids);
      const s = serials.read();
      if (s[0][0] === serial[0]) {
        this.addSerials(serials, serial, t, l, ids);
      } else {
        this.incId(t, l, ids);
        this.createSerials(t, l, type, ids);
        serials = this.getSerials(t, l, ids);
        this.addSerials(serials, serial, t, l, ids);
      }
    }
  }

  createSerials(t, l, type, ids, name) {
    const { pkgPath, } = this;
    if (name === undefined) {
      name = this.getName(t, l, ids);
    }
    const ip = getIdsPath(ids);
    const p = path.join(pkgPath, ip);
    const serials = new Serials(p, name);
    serials.create(type);
  }

  addSerials(serials, serial, t, l, ids) {
    const ip = getIdsPath(ids);
    const { h, } = this;
    if (!h[ip]) {
      const s = serials.read();
      this.hashSerial(s, ip, 0);
    }
    if (!h[ip][serial[0]]) {
      serials.add(serial);
      const newSerial = serials.read();
      this.hashSerial(newSerial, ip, 0);
    }
  }

  hashSerial(serial, ip, i) {
    const { h, } = this;
    h[ip] = getHashTable(serial, i);
  }
}

export default InstanceIndex;
