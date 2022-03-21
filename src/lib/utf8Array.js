export function fromInt(n) {
  n = BigInt(n);
  const size = 2n ** 16n;
  const ans = [];
  if (n > size - 34n) {
   while (n > size - 32n) {
      const q = Math.floor(n / size - 32n);
      ans.push(Number(q + 32n));
      n = n % size;
    }
  }
  ans.push(Number(n + 32n));
  return ans;
}

export function toInt(buf) {
  const size = 2n ** 16n;
  let n = 0n;
  const { length, } = buf;
  for (let i = 0n; i < buf.length; i += 1n) {
    n += (BigInt(buf[BigInt(length) - 1n - i]) - 32n) * (size - 32n) ** i;
  }
  return n;
}
