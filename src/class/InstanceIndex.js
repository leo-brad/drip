import fs from 'fs';
import path from 'path';
import Table from '~/class/Table';
import Serials from '~/class/Serials';
import ContentHash from '~/class/ContentHash';
import * as nonZeroByteArray from '~/lib/nonZeroByteArray';
import * as byteArray from '~/lib/byteArray';

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

function getIntStringWitnEnd(i) {
  let byteArr = nonZeroByteArray.fromInt(i);
  byteArr.push(0);
  return Buffer.from(byteArr).toString();
}

function getIntString(i) {
  let byteArr = nonZeroByteArray.fromInt(i);
  return Buffer.from(byteArr).toString();
}

class InstanceIndex {
  constructor({ l=2, }) {
    this.m = {};
    this.h = {};
    this.l = l;
    this.ch = new ContentHash();
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
      path.join(pkgPath, 'l' + getIntString(l)),
      c.length.toString(), ['i', 'i'], [c.length, this.getId('l', l, c)],
    );
    this.perpareSerials(
      path.join(pkgPath, 'h' + getIntString(l)),
      c, ['h', 'i'], [c, this.getId('h', l, c)],
    );
  }

  perpareLastLevel(c) {
    const { iiPath, } = this;
    const idxPath = path.resolve(path.join(iiPath, h));
    const totalPath = path.join(idxPath, 't');
    if (!fs.existsSync(idxPath)) {
      fs.mkdirSync(idxPath, { recursive: true, });
      fs.appendFileSync(totalPath, Buffer.from(fromInt(0)));
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
    const [_, pkg] = location.match(/^\.drip\/local\/instance\/\[(\w+)\]:(\w+)$/);
    const pkgPath = path.join(iiPath, pkg);
    if (!fs.existsSync(pkgPath)) {
      fs.mkdirSync(pkgPath);
    }
    this.pkgPath = pkgPath;
  }

  getIdPath(type, l, h) {
    let idPath;
    switch (type) {
      case 'l':
        idPath = path.join(
          pkgPath, 'l' + Buffer.from(byteArray.fromInt(l)).toString(),
        );
        break;
      case 'h':
        idPath = path.join(
          pkgPath, 'l' + c,
        );
        break;
    }
    return idPath;
  }

  getId(type, l, h) {
    const { pkgPath, } = this;
    const idPath = this.getIdPath(type, l, h);
    let id;
    if (!fs.existsSync(idPath)) {
      const fd = fs.openSync(idPath, 'w');
      const buf = Buffer.from(byteArray.fromInt(0));
      fs.writeFileSync(fd, buf);
      id = 0;
    } else {
      const fd = fs.openSync(idPath, 'r');
      id = byteArray.toInt(fs.readFileSync(fd));
    }
    return id;
  }

  incId(type, l, h) {
    const idPath = this.getIdPath(type, l, h);
    const fd = fs.openSync(idPath, 'rw');
    let id = byteArray.toInt(fs.readFileSync(fd));
    id += 1;
    fs.writeFileSync(fd, byteArray.fromInt(id));
  }

  perpareSerials(path, name, type, serial, id) {
    if (id === undefined) {
      id = '';
    } else {
      id = String(id)
    }
    const { m, } = this;
    let serials = new Serials(path + id, name);
    if (!serials.check()) {
      this.incId();
      const newId = this.getId('h', l, c);
      serialis = new Serials(path + newId)
      serials.create(type);
    }
    const serial = this.getSerial(name);
    this.updateSerials(serials, serial, name);
    const { m, } = this;
    let serials = new Serials(path + id, name);
    if (!serials.check()) {
      const newId = this.getId('h', l, c);
      serialis = new Serials(path + newId)
      serials.create(type);
    }
    const serial = this.getSerial(name);
    this.updateSerials(serials, serial, name);
  }

  updateSerials(serials, serial, name ) {
    const { h, } = this;
    if (!h[name].has(serial)) {
      serials.add(serial);
      this.hashSerial(serial, name);
    }
  }

  getSerial(name) {
    const { m, } = this;
    if (m[name] === undefined) {
      m[name] = serials;
    }
    return m[name];
  }

  hashSerial(serials, name) {
    const { m, h, } = this;
    if (m[name] === undefined) {
      m[name] = serials;
    }
    return serial;
  }
}

export default InstanceIndex;
