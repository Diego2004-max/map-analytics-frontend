const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getReports = async () => {
  const response = await fetch(`${API_URL}/api/reports`);
  return response.json();
};

export const createReport = async (reportData) => {
  const response = await fetch(`${API_URL}/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  });
  return response.json();
};