// Prefix an internal path with the configured base (e.g. /portfolio) so
// links and assets resolve correctly under a GitHub Pages project site.
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${String(path).replace(/^\//, '')}`;
}
