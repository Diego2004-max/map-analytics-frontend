const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'No fue posible completar la solicitud.');
  return body;
}

export const api = {
  getReports: () => request('/reports'),
  createReport: (report) => request('/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) }),
  scanRadar: () => request('/monitor/scan'),
  verifyGoogleCredential: (credential) => request('/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) }),
  login: (email, password) => request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => request('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
};
