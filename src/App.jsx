import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { ReportForm } from './components/ReportForm';
import { Radar, ShieldAlert, CheckCircle2, RefreshCw, MapPin, Globe, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!user && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: "756822032174-lb6mm8kg6qasoabcdhdvuq4lufi8uhh0.apps.googleusercontent.com",
          callback: (response) => {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const googleUser = JSON.parse(jsonPayload);
            setUser({
              name: googleUser.name,
              email: googleUser.email,
              avatar: googleUser.picture
            });
          }
        });

        window.google.accounts.id.renderButton(
          document.getElementById("welcome-google-btn"),
          { theme: "outline", size: "large", width: "100%", shape: "pill" }
        );
      } catch (err) {
        console.error("Error al inicializar botón de Google:", err);
      }
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reports`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || data.data || []);
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

  const formatReportLocation = (lat, lon) => {
    const la = parseFloat(lat || 1.204265);
    const lo = parseFloat(lon || -77.295042);
    const enColombia = la >= -4.23 && la <= 12.46 && lo >= -79.0 && lo <= -66.85;
    if (enColombia) {
      return "🇨🇴 Colombia";
    }
    return ` Internacional (${la.toFixed(1)}, ${lo.toFixed(1)})`;
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 w-full max-w-sm sm:max-w-md p-6 sm:p-8 text-center relative z-10">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl mb-4 shadow-lg">
            <Globe className="w-7 h-7 animate-pulse" />
          </div>
          
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
            Plataforma Segura AI
          </span>

          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-3">
            Map Analytic AI
          </h1>
          
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 mb-6 leading-relaxed">
            Monitoreo espacial de anomalías en tiempo real. Inicia sesión con Google para acceder.
          </p>

          <div className="flex justify-center w-full min-h-[45px] overflow-hidden">
            <div id="welcome-google-btn" className="w-full flex justify-center"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} user={user} setUser={setUser} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Banner de Radar Adaptable */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="relative z-10 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold mb-2">
              <Radar className="w-3.5 h-3.5 animate-spin" /> Monitoreo Espacial Activo
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">Centro de Inteligencia Territorial</h2>
            <p className="mt-1.5 text-blue-100 text-xs sm:text-sm max-w-xl">
              Plataforma satelital de detección y análisis de anomalías en Colombia y el mundo.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex justify-center">
            <button
              onClick={handleScanRadar}
              disabled={scanning}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all text-xs sm:text-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Escaneando...' : 'Escanear Radar Nacional'}</span>
            </button>
          </div>
        </div>

        {/* Resultados del Escaneo Satelital */}
        {scanResult && (() => {
          const anomalias = scanResult.anomalies || scanResult.data || [];
          
          const colomAnomalies = anomalias.filter(a => {
            const la = parseFloat(a.latitude || 1.2);
            const lo = parseFloat(a.longitude || -77.2);
            return la >= -4.23 && la <= 12.46 && lo >= -79.0 && lo <= -66.85;
          });

          const interAnomalies = anomalias.filter(a => {
            const la = parseFloat(a.latitude || 1.2);
            const lo = parseFloat(a.longitude || -77.2);
            return !(la >= -4.23 && la <= 12.46 && lo >= -79.0 && lo <= -66.85);
          });

          return (
            <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 gap-2">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" /> Resultados del Análisis Satelital
                </h3>
                <span className="self-start sm:self-auto text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                  {anomalias.length} detectadas
                </span>
              </div>

              {/* Monitoreo en Colombia */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <h4 className="text-[11px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  🇨🇴 Monitoreo en Colombia
                </h4>
                {colomAnomalies.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Se han detectado {colomAnomalies.length} anomalías en territorio nacional:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {colomAnomalies.map((item, index) => (
                        <div key={index} className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block truncate">{item.title || 'Incidente en Colombia'}</span>
                          <p className="text-gray-600 dark:text-gray-300 mt-0.5 text-[11px] line-clamp-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>En Colombia aún no se detectan anomalías en este escaneo.</span>
                  </div>
                )}
              </div>

              {/* Informes Globales / Internacionales */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  Informes Globales / Internacionales (Máx. 5)
                </h4>
                {interAnomalies.length === 0 ? (
                  <p className="text-xs text-gray-500">No hay informes internacionales.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {interAnomalies.slice(0, 5).map((item, index) => {
                      const la = parseFloat(item.latitude || 0);
                      const lo = parseFloat(item.longitude || 0);
                      
                      return (
                        <div key={index} className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 inline-block mb-1.5">
                              {item.category || 'Anomalía'}
                            </span>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                              {item.title || 'Incidente externo'}
                            </p>
                            <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {item.description || 'Sin descripción.'}
                            </p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-blue-100 dark:border-blue-900/40 text-[10px] font-medium text-blue-600 dark:text-blue-400 truncate">
                             ({la.toFixed(1)}, {lo.toFixed(1)})
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Grid Principal Adaptable */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="w-full lg:col-span-5">
            <ReportForm onReportCreated={fetchReports} user={user} />
          </div>

          <div className="w-full lg:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" /> Reportes del Sistema
                </h3>
                <span className="text-xs px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                  {reports.length}
                </span>
              </div>

              {loading ? (
                <div className="py-10 text-center text-gray-500 text-xs sm:text-sm">Cargando reportes...</div>
              ) : reports.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-gray-500 text-xs sm:text-sm">No hay reportes registrados aún.</p>
                  <p className="text-[11px] text-gray-400 mt-1">Usa el formulario para crear el primero.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-900/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">{report.title}</h4>
                        <span className="self-start sm:self-auto px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold rounded-lg">
                          {report.category || 'General'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mt-1.5 leading-relaxed">{report.description}</p>
                      
                      <div className="mt-3 pt-2.5 border-t border-gray-200/60 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {formatReportLocation(report.latitude, report.longitude)}
                        </span>
                        <span className="text-gray-400 truncate max-w-[200px]">Por: {report.author || 'Anónimo'}</span>
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