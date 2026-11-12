const configuredUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');
const baseUrl = configuredUrl.endsWith('/api/v1') ? configuredUrl : `${configuredUrl}/api/v1`;
const serviceUrl = baseUrl.replace(/\/api\/v1$/, '');

async function request(path, options) {
  let token;
  try { token = JSON.parse(sessionStorage.getItem('map-analytic-session') || 'null')?.token; } catch {}
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { ...options?.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) }, signal: AbortSignal.timeout(45_000) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || (response.status === 503 ? 'El servidor está iniciando. Inténtalo en unos segundos.' : 'No fue posible completar la solicitud.'));
  return body;
}

export const api = {
  deleteReport: (id) => request(`/reports/${id}`, { method: 'DELETE' }),
  warmUp: () => fetch(`${serviceUrl}/api/health`, { signal: AbortSignal.timeout(45_000) }),
  getReports: () => request('/reports'),
  createReport: ({ attachments = [], ...report }) => {
    const body = new FormData();
    Object.entries(report).forEach(([key, value]) => body.append(key, String(value)));
    attachments.forEach((file) => body.append('attachments', file));
    return request('/reports', { method: 'POST', body });
  },
  scanRadar: () => request('/monitor/scan'),
  verifyGoogleCredential: (credential) => request('/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) }),
  login: (email, password) => request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => request('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) }),
  attachmentUrl: (url) => `${baseUrl.replace(/\/api\/v1$/, '')}${url}`
};
