export function nowISO() {
  return new Date().toISOString();
}

export function shortId(n = 6) {
  return Math.random().toString(36).slice(2, 2 + n);
}
