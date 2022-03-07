class ContentHash {
  constructor({ size=256, long=6, start, end, }) {
    this.size = size;
    this.long = long;
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

  getHash(content) {
    const { size, long, } = this;
    const groups = [];
    const start = 0;
    const end = Math.ceil(content.length / long) * long;
    let group = 0;
    for (let i = start; i <= end; i += 1) {
      const s = i % long;
      let charCode = content.charCodeAt(i);
      if (charCode === NaN) {
        charCode = 0;
      }
      group += charCode * size ** s;
      if (s === long - 1) {
        groups.push(group);
        group = 0;
      }
    }
    return groups.map((g) => String.fromCharCode(g % (2 ** 16) + 1)).join('');
  }
}

export default ContentHash;
