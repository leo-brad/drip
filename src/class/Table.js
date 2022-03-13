import { toInt, fromInt, } from '~/lib/byteArray';
import path from 'path';
import fs from 'fs';

class Table {
  constructor(path, name) {
    this.path = path;
    this.name = name;
    this.specsPath = path.join(path, name + '-s');
    this.tbPath = path.join(path, name);
    this.lengthPath = path.join(path, name + '-l');
    this.initMem();
  }

  initMem() {
    const { lengthPath, specsPath, } = this;
    const lengthFd = fs.openSync(lengthPath, 'r');
    const length = Buffer.alloc(fs.fstatSync(lengthFd).size);
    fs.readSync(lengthFd, length, 0, length.length, 0);
    this.length = toInt(length);
    this.specs = JSON.parse(fs.readFileSync(specsPath));
    this.total = fs.fstatSync(fs.openSync(tbPath, 'r')).size;
  }

  create(name, specs) {
    const { tbPath, specsPath, lengthPath, } = this;
    fs.appendFileSync(specsPath, JSON.stringify(specs));
    let length = 0;
    specs.forEach((s) => {
      const [_, l] = s;
      length += l;
    });
    fs.appendFileSync(
      lengthPath,
      Buffer.from(fromInt(length)),
    );
    fs.openSync(tbPath, 'a');
  }

  check(name) {
    const { tbPath, specsPath, lengthPath, } = this;
    let ans = true;
    if (!fs.existsSync(tbPath)) {
      ans = false;
    }
    if (!fs.existsSync(specsPath)) {
      ans = false;
    }
    if (!fs.existsSync(lengthPath)) {
      ans = false;
    }
    return ans;
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
    const { length, total, } = this;
    const c = total / length;
    const ans = [];
    for (let i = 0; i < c; i += 1) {
      ans.push(this.select(i));
    }
    return ans;
  }
}

export default Table;
