import fs from 'fs';
import path from 'path';
import Serials from '~/class/Serials';
import ContentHash from '~/class/ContentHash';
import * as nonZeroByteArray from '~/lib/nonZeroByteArray';
import * as byteArray from '~/lib/byteArray';
import * as utf8Array from '~/lib/utf8Array';
import contentCompare from '~/lib/contentCompare';

function getHashTable(serial, i) {
  const hashTable = {};
  serial.forEach((e) => {
    const k= e[i];
    hashTable[k] = true;
  });
  return hashTable;
}

// @TODO
function iteratorLastId(idxPath, total, c) {
  let ans = -1;
  for (let i = 0; i <= total; i += 1) {
    const idPath = path.join(idxPath, 'c' + Buffer.from(utf8Array.fromInt(i)).toString());
    if (c === fs.readFileSync(idPath).toString()) {
      ans = i;
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

// @TODO
function getCntDiff(c, idxPath) {
  const zeroIdPath = path.join(idxPath, 'c' + Buffer.from(utf8Array.fromInt(0)).toString());
  const zeroC = fs.readFileSync(zeroIdPath).toString();
  return contentCompare(zeroC, c);
}

function makeIdNode(idxPath, totalPath, idBuf, c, isZero) {
  const idPath = path.join(idxPath, 'c' + idBuf.toString());
  fs.appendFileSync(idPath, c);
  fs.writeFileSync(fs.openSync(totalPath, 'w'), idBuf);

  if (!isZero) {
    const diffPath = path.join(idxPath, 'd' + idBuf.toString());
    fs.appendFileSync(diffPath, JSON.stringify(getCntDiff(c, idxPath)));
  }

  const serials = findRecordById(idxPath, idBuf);
  serials.create(['i', 'i']);
  return serials;
}

function findRecordById(idxPath, idBuf) {
  const recordPath = path.join(idxPath, 'r');
  const serials = new Serials(recordPath, idBuf.toString());
  return serials;
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
    return this.perpareLastLevel(hashs[hashs.length - 1], content, ids);
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
    let ans;
    if (!fs.existsSync(idxPath)) {
      const idBuf = Buffer.from(utf8Array.fromInt(0));
      fs.mkdirSync(idxPath, { recursive: true, });
      ans = makeIdNode(idxPath, totalPath, idBuf, c, true);
    } else {
      const total = utf8Array.toInt(fs.readFileSync(totalPath));
      const idBuf = Buffer.from(utf8Array.fromInt(total + 1n));
      const id = iteratorLastId(idxPath, total, c);
      if (id === -1) {
        ans = makeIdNode(idxPath, totalPath, idBuf, c, false);
      } {
        ans = findRecordById(idxPath, idBuf);
      }
    }
    return ans;
  }

  incLastId(hash, ids) {
    const { l, h, } = this;
    const name = Buffer.from(utf8Array.fromInt(this.getId('l', l + 2, ids))).toString();
    const serials = this.getSerials('l', l + 2, ids);
    if (!serials.check()) {
      serials.create(['i']);
      serials.addOne([hash.length]);
    }
    const ip = getIdsPath(ids);
    let s;
    if (!h[ip]) {
      s = serials.readAll();
      this.hashSerial(s, ip, 0);
    }
    if (!h[ip][hash.length]) {
      serials.addOne([hash.length]);
      s = serials.readAll();
      h[ip][hash.length] = true;
    } else {
      s = serials.readAll();
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
      const s = serials.readAll();
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
      const s = serials.readAll();
      this.hashSerial(s, ip, 0);
    }
    if (!h[ip][serial[0]]) {
      serials.addOne(serial);
      const newSerial = serials.readAll();
      this.hashSerial(newSerial, ip, 0);
    }
  }

  hashSerial(serial, ip, i) {
    const { h, } = this;
    h[ip] = getHashTable(serial, i);
  }
}

export default InstanceIndex;
