import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { ReportForm } from './components/ReportForm';
import { Radar, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [darkMode, setDarkMode] = useState(false); // Por defecto Light Mode
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Sincronizar clase "dark" en el elemento raíz HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const handleScanRadar = async () => {
    setScanning(true);
    try {
      const res = await fetch(`${API_URL}/api/monitor/scan`);
      const data = await res.json();
      if (data.success) {
        setScanResult(data);
      }
    } catch (error) {
      console.error('Error en el escaneo:', error);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de Radar */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
              <Radar className="w-3.5 h-3.5 animate-spin" /> Monitoreo Satelital Activo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Centro de Inteligencia Territorial</h2>
            <p className="mt-2 text-blue-100 text-sm">
              Escaneo en tiempo real de anomalías territoriales y geológicas en Colombia potenciado con motores de IA.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleScanRadar}
              disabled={scanning}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Escaneando...' : 'Escanear Radar Nacional'}</span>
            </button>
          </div>
        </div>

        {/* Resultado del Escaneo por Radar si existe */}
        {scanResult && (
          <div className="mb-8 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Resultados del Radar Satelital
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                {scanResult.count} anomalías detectadas
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              El análisis territorial se completó con éxito en las regiones monitoreadas.
            </p>
          </div>
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <ReportForm onReportCreated={fetchReports} />
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Reportes Registrados en el Sistema
                </h3>
                <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                  {reports.length} totales
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Cargando reportes desde la base de datos...
                </div>
              ) : reports.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No hay reportes registrados en la base de datos aún.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Usa el formulario de la izquierda para crear el primero.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-xl border border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-base text-gray-900 dark:text-white">{report.title}</h4>
                        <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg whitespace-nowrap">
                          {report.category || 'General'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">{report.description}</p>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Coordenadas: {report.latitude || '1.204265'}, {report.longitude || '-77.295042'}</span>
                        <span className="font-medium text-gray-400 dark:text-gray-500">ID #{report.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}