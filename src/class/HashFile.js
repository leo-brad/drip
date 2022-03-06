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

  getPart() {
    const { l, } = this;
    return 7 * 6 ** l;
  }

  indexFile(location) {
    const { l, } = this;
    const i = [];
    const c = fs.readFileSync(location).toString();
    let p = c.substring(0, this.getPart());
    for (let j = 1; j <= l; j += 1) {
      p = new ContentHash({ content: p, }).getHash();
      i.unshift(p);
    }
    let h;
    for (let j = 0; j < i.length; j += 1) {
      const k = i[j];
      h = this.perpareNextLevel(k, h, j + 1);
    }
    this.perpareInstanceIndex(i.pop(), c);
  }

  perpareNextLevel(c, h=this.h, level) {
    const { db, l, } = this;
    let ans;
    if (level === 1) {
      this.perpareTable('fi', 7);
      const tb = db.selectTable('fi');
      this.updateIndex(tb, h, c);
      ans = h;
    } else {
      this.perpareTable(c, (level - 1) * 6 * 7);
      const tb = db.selectTable(c);
      this.updateIndex(tb, h, c);
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
