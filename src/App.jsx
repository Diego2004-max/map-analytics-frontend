import React, { useEffect, useState } from 'react';
import { ReportForm } from './components/ReportForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reports`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error al obtener reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Map Analytic Dashboard</h1>
        <p className="text-gray-600">Sistema de gestión y análisis territorial en la nube</p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Crear Nuevo Reporte</h2>
          <ReportForm onReportCreated={fetchReports} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Reportes Registrados</h2>
          {loading ? (
            <p>Cargando reportes...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-500">No hay reportes guardados aún.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="bg-white p-4 rounded shadow">
                  <h3 className="font-bold text-lg text-blue-700">{report.title}</h3>
                  <p className="text-gray-700 text-sm mt-1">{report.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {report.category || 'General'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}