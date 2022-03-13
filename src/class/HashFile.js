import fs from 'fs';
import path from 'path';
import Table from '~/class/Table';
import Serials from '~/class/Serials';
import ContentHash from '~/class/ContentHash';
import * as nonZeroByteArray from '~/lib/nonZeroByteArray';

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

function getIntString(i) {
  let byteArr = nonZeroByteArray.fromInt(i);
  byteArr.push(0);
  return Buffer.from(byteArr).toString();
}

class HashFile {
  constructor({ l=2, }) {
    this.m = {};
    this.l = l;
    this.ch = new ContentHash();
    this.iiPath = path.join('.drip', 'local', 'ii');
  }

  indexInstance(location) {
    this.perpare(location);
    const { l, ch, } = this;
    const i = [];
    let c = fs.readFileSync(location).toString();
    for (let j = 1; j <= l; j += 1) {
      c = ch.getHash(c);
      i.unshift(c);
    }
    for (let j = 0; j < i.length; j += 1) {
      this.perpareNextLevel(i[j], j + 1);
    }
    this.perpareInstanceIndex(i.pop(), c);
  }

  findRecord() {
  }

  perpareNextLevel(c, l) {
    const { pkgPath, m, } = this;
    this.perpareSerials(
      path.join(pkgPath, 'l' + getIntString(l) + String(id)),
      c.length.toString(), ['i', 'i'], [c.length, id],
    );
    this.perpareSerials(
      path.join(pkgPath, 'l' + getIntString(l) + String(id)),
      c.length.toString(), ['i', 'i'], [c.length, id],
    );
  }

  perpareInstanceIndex(h, c) {
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

  perpareTable(path, name, specs) {
    const { pkgPath, m, } = this;
    const tb = new Table(pkgPath, name);
    if (!tb.check()) {
      serials.create(specs);
    }
    const strip = this.getStrip(tb, name);
  }

  perpareSerials(path, name, type) {
    const { pkgPath, m, } = this;
    const serials = new Serials(pkgPath, name);
    if (!serials.check()) {
      serials.create(type);
    }
    const serial = this.getSerial(serials, name);
  }

  getSerial(serials, name) {
    const { m, } = this;
    if (m[name] === undefined) {
      m[name] = serials.read();
    }
    return m[name];
  }

  getStrip(tb, name) {
    const { m, } = this;
    if (m[name] === undefined) {
      m[name] = serials.selectAll();
    }
    return m[name];
  }
}

export default HashFile;
