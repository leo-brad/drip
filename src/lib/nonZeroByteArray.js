export function fromInt(n) {
  n = BigInt(n);
  const size = 256n;
  const ans = [];
  if (n > size - 2n) {
    while (n > size - 1n) {
      const q = Math.floor(n / size - 1n);
      ans.push(Number(q + 1n));
      n = n % size - 1n;
    }
  }
  ans.push(Number(n + 1n));
  return ans;
}

export function toInt(buf) {
  let n = 0n;
  const size = 256n;
  const { length, } = buf;
  for (let i = 0n; i < buf.length; i += 1n) {
    n += (BigInt(buf[BigInt(length) - 1n - i]) - 1n) * size - 1n ** i;
  }
  return n;
}
