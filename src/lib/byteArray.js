export function fromInt(n) {
  const ans = [];
  if (n > 255) {
    while (n > 256) {
      const q = Math.floor(n / 256);
      ans.push(q);
      n = n % 256;
    }
  }
  ans.push(n);
  return ans;
}

export function toInt(buf) {
  let n = 0;
  const { length, } = buf;
  for (let i = 0; i < buf.length; i += 1) {
    n += buf[length - 1 - i] * 256 ** i;
  }
  return n;
}
