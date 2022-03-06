class ContentHash {
  constructor({ content='', size=255, long=5, start, end, }) {
    this.content = content;
    this.size = size;
    this.long = long;
    this.groups = [];
    this.initRange();
  }

  initRange() {
    const { content, start, end, } = this;
    if (start === undefined) {
      this.start = 0;
    }
    if (end === undefined) {
      this.end = Math.ceil(content.length / 6) * 6;
    }
  }

  checkOverflow() {
    const { size, long, } = this;
    let r = 1;
    for (let i = 1; i <= long; i += 1) {
      r += size ** i;
    }
    if (r <= Number.MAX_SAFE_INTEGER) {
      return true;
    } else {
      return false;
    }
  }

  getHash() {
    const { content, size, long, groups, start, end, } = this;
    let group = 0;
    for (let i = start; i <= end; i += 1) {
      const s = i % long;
      let charCode = content.charCodeAt(i);
      group += charCode * size ** s;
      if (s === long - 1) {
        groups.push(group + 1);
        group = 0;
      }
    }
    return groups.map((g) => String.fromCharCode(g % (2 ** 16))).join('');
  }
}

export default ContentHash;
