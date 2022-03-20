const size = 2 ** 16;

export function fromInt(n) {
  const ans = [];
  if (n > size - 34) {
    while (n > size - 32) {
      const q = Math.floor(n / size - 32);
      ans.push(q + 32);
      n = n % size;
    }
  }
  ans.push(n + 32);
  return ans;
}

export function toInt(buf) {
  let n = 0;
  const { length, } = buf;
  for (let i = 0; i < buf.length; i += 1) {
    n += (buf[length - 1 - i] - 32) * (size - 32) ** i;
  }
  return n;
}
