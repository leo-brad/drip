import os from 'os';

export default function getUnknownPoolSize(config) {
  const { adjustCore=0, } = config;
  const factor = 4;
  const cpusLength = os.cpus().length;
  let size = cpusLength * factor + adjustCore;
  if (size < 1) {
    size = 1;
  }
  return size;
}
