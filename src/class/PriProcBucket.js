class PriProcBucket {
  constructor(all, k) {
    this.all = all;
    this.k = k;
    this.buckets = new Array(all);
    this.makeQuickIndex(this.buckets, this.k);
  }

  get count() {
    const { qi, l, } = this;
    return this.qi[l][0];
  }

  makeQuickIndex() {
    const { all, k, buckets, } = this;
    const qi = [buckets];
    let l = 1;
    qi[0] = buckets;
    while ((all / k ** l) >= 1) {
      qi[l] = new Array((all / k ** l)).fill(0);
      l += 1;
    }
    this.qi = qi;
    this.l = l - 1;
  }

  addQuickIndex(pri) {
    const { l, qi, k, } = this;
    qi[l][0] += 1;
    for (let i = 0; i < l; i += 1) {
      const j = (Math.floor(pri / k ** (i + 1))) - 1;
      qi[l- i - 1][j] += 1;
    }
  }

  addPriProc(pri, proc) {
    const { buckets, } = this;
    const bucket = buckets[pri];
    if (!Array.isArray(bucket)) {
      buckets[pri] = [];
    }
    buckets[pri].push(proc);
    this.addQuickIndex(pri);
  }

  get highestProc() {
    const { qi, l, } = this;
    let ans = null;
    if (qi[l][0] > 0) {
      const i = this.quickSearch();
      if (i !== -1) {
        ans =  this.iteratorBucketsByIndex(i);
      }
    }
    return ans;
  }

  iteratorBucketsByIndex(i) {
    let ans = null;
    const { buckets, k, } = this;
    for (let j = i + k - 1; j >= i - 1 ; j -= 1) {
      const bucket = buckets[j];
      if (Array.isArray(bucket) && bucket.length > 0) {
        ans = bucket.pop();
        break;
      }
    }
    return ans;
  }

  quickSearch() {
    const { l, qi, k, } = this;
    let ans = -1;
    if (qi[l][0] > 0) {
      qi[l][0] -= 1;
      let o = 0;
      for (let i = 1; i < l; i += 1) {
        const c = qi[l - i];
        for (let j = o + k - 1; j >= o; j -= 1) {
          if (c[j - 1] > 0) {
            o += j * (k ** (l - i));
            c[j - 1] -= 1;
            break;
          }
        }
      }
      ans = o;
    }
    return ans;
  }
}

export default PriProcBucket;
