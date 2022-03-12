import fs from 'fs';
import path from 'path';
import ContentHash from '~/class/ContentHash';
import Database from '~/class/Database';
import { fromInt, toInt, } from '~/lib/byteArray';

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

function getHashTable(l) {
  const h = {};
  l.forEach((e) => {
    h[e] = true;
  });
  return h;
}

class HashFile {
  constructor({ l=2, }) {
    this.h = {};
    this.l = l;
    this.ch = new ContentHash();
    this.dbPath = path.join('.drip', 'local', 'db');
    this.iiPath = path.join('.drip', 'local', 'ii');
    this.perpare();
  }

  updateIndex(tb, h, c) {
    if (h === undefined) {
      h = getHashTable(tb.selectAll());
    }
    if (h[c] === undefined) {
      tb.insert([c]);
      h[c] = true;
    }
  }

  getPart(content) {
    const { l, } = this;
    const p = 12 * 6 ** l;
    return content.substring(0, p);
  }

  indexFile(location) {
    const { l, ch, } = this;
    const i = [];
    const c = fs.readFileSync(location).toString();
    let part = this.getPart(c);
    for (let j = 1; j <= l; j += 1) {
      part = ch.getHash(part);
      i.unshift(part);
    }
    let h;
    for (let j = 0; j < i.length; j += 1) {
      h = this.perpareNextLevel(i[j - 1], i[j], h, j + 1);
    }
    this.perpareInstanceIndex(i.pop(), c);
  }

  findRecord() {
  }

  perpareNextLevel(c1, c2, h=this.h, level) {
    const { db, l, } = this;
    let ans;
    if (level === 1) {
      this.perpareTable('fi', 12);
      const tb = db.selectTable('fi');
      this.updateIndex(tb, h, c2);
      ans = h;
    } else {
      this.perpareTable(c1, 6 ** (level - 1) * 12);
      const tb = db.selectTable(c1);
      this.updateIndex(tb, h, c2);
      ans = h;
    }
    return ans;
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

  perpare() {
    this.perpareDb();
  }

  perpareDb() {
    const { dbPath, } = this;
    this.db = new Database({ dbPath, });
  }

  perpareTable(name, size) {
    const { db, } = this;
    if (!db.checkTable(name)) {
      db.createTable(name, [['s', size]]);
    }
  }
}

export default HashFile;
