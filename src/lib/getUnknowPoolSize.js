import os from 'os';

export default function getUnknownPoolSize(config) {
  const { adjustCore=0, } = config;
  const factor = 5;
  const cpusLength = os.cpus().length;
  let size = (cpusLength + adjustCore) * factor;
  if (size < 1) {
    size = 1;
  }
  return size;
}
