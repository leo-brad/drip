export default function getPkgNames(packages) {
  return packages.map((p) => {
    if (p.pkg) {
      return p.pkg;
    }
  });
}
