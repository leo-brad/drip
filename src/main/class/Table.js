import { toInt, fromInt, } from '~/main/lib/byteArray';
import path from 'path';
import fs from 'fs';

class Table {
  constructor({ name, dbPath, }) {
    this.dbPath = dbPath;
    this.name = name;
    const lengthFd = fs.openSync(path.join(dbPath, name + '-l'), 'r');
    const length = Buffer.alloc(fs.fstatSync(lengthFd).size);
    fs.readSync(lengthFd, length, 0, length.length, 0);
    this.length = toInt(length);
    this.specs = JSON.parse(fs.readFileSync(path.join(dbPath, name + '-s')));
    const tbPath = path.join(dbPath, name);
    this.total = fs.fstatSync(fs.openSync(tbPath, 'r')).size;
    this.tbPath = tbPath;
  }

  fromStrip(strip) {
    const { specs, } = this;
    return Buffer.concat(
      specs.map((s, i) => {
        const [t, l] = s;
        switch (t) {
          case 'i':
            return Buffer.from(fromInt(strip[i], l));
          case 's':
            return Buffer.from(strip[i].padEnd(l, ' '));
        }
      }),
    );
  }

  toStrip(buf) {
    const { specs, } = this;
    let p = 0;
    return specs.map((s) => {
      const [t, l] = s;
      const b = buf.slice(p, p + l);
      p += l;
      switch (t) {
        case 'i':
          return toInt(b);
        case 's':
          return b.toString().trimEnd();
      }
    });
  }

  insert(data) {
    const buf = this.fromStrip(data);
    const { tbPath, total, } = this;
    const fd = fs.openSync(tbPath, 'a');
    fs.writeSync(fd, buf, 0, buf.length, total);
    this.total += buf.length;
  }

  update(id, data) {
    const buf = this.fromStrip(data);
    const { tbPath, total, } = this;
    const fd = fs.openSync(tbPath, 'w');
    fs.writeSync(fd, buf, 0, buf.length, id * buf.length - 1);
  }

  select(id) {
    const { tbPath, length, } = this;
    const buf = Buffer.alloc(length);
    fs.readSync(fs.openSync(tbPath, 'r'), buf, 0, length, id * length);
    return this.toStrip(buf);
  }

  selectAll() {
    const { length, } = this;
    const c = total / length;
    const ans = [];
    for (let i = 0; i < c; i += 1) {
      ans.push(this.select(i));
    }
    return ans;
  }
}

export default Table;
