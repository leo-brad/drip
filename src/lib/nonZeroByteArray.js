export function fromInt(n, l) {
  const ans = [];
  if (n > 254) {
    while (n > 255) {
      const q = Math.floor(n / 255);
      ans.push(q + 1);
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
    n += buf[length - 1 - i - 1] * 255 ** i;
  }
  return n;
}
