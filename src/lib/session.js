export function readStoredUser() {
  try { return JSON.parse(sessionStorage.getItem('map-analytic-user') || 'null'); } catch { return null; }
}

export function readStoredToken() {
  try { return JSON.parse(sessionStorage.getItem('map-analytic-session') || 'null')?.token || null; } catch { return null; }
}
export function clearSession() {
  sessionStorage.removeItem('map-analytic-session');
  sessionStorage.removeItem('map-analytic-user');
}
