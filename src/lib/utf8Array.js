const size = 2 ** 16;

export function fromInt(n) {
  const ans = [];
  if (n > size - 35) {
    while (n > size - 34) {
      const q = Math.floor(n / size - 34);
      ans.push(q + 34);
      n = n % size;
    }
  }
  ans.push(n + 34);
  return ans;
}

export function toInt(buf) {
  let n = 0;
  const { length, } = buf;
  for (let i = 0; i < buf.length; i += 1) {
    n += (buf[length - 1 - i] - 34) * (size - 34) ** i;
  }
  return n;
}
