export function fromInt(n) {
  n = BigInt(n);
  const size = 256n;
  const ans = [];
  if (n > size - 1n) {
    while (n > size) {
      const q = Math.floor(n / size);
      ans.push(Number(q));
      n = n % size;
    }
  }
  ans.push(Number(n));
  return ans;
}

export function toInt(buf) {
  const size = 256n;
  let n = 0n;
  const { length, } = buf;
  for (let i = 0n; i < buf.length; i += 1n) {
    n += BigInt(buf[BigInt(length) - 1n - i]) * size ** i;
  }
  return n;
}
