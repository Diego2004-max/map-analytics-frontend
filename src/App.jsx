import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { ReportForm } from './components/ReportForm';
import { Radar, ShieldAlert, CheckCircle2, RefreshCw, MapPin, ShieldCheck, Globe, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [darkMode, setDarkMode] = useState(false); // Light por defecto
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

  // Inicializar Google Sign-In real para la pantalla de bienvenida obligatoria
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
      return "🇨🇴 Colombia (Territorio Nacional)";
    }
    return `🌍 Ubicación Internacional (${la.toFixed(2)}, ${lo.toFixed(2)})`;
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  // ==========================================
  // PANTALLA DE BIENVENIDA / AUTENTICACIÓN (REDISEÑADA Y ELEGANTE)
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-[2.5xl] shadow-2xl border border-white/20 dark:border-gray-800 w-full max-w-md p-8 sm:p-10 text-center relative z-10 transition-all">
          <div className="inline-flex p-4 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl mb-5 shadow-lg shadow-blue-500/30">
            <Globe className="w-8 h-8 animate-pulse" />
          </div>
          
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider">
            Plataforma Segura AI
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3 tracking-tight">
            Map Analytic AI
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2.5 mb-8 leading-relaxed">
            Centro de inteligencia espacial y monitoreo de anomalías en tiempo real. Autentícate con tu cuenta institucional de Google para continuar.
          </p>

          <div className="flex justify-center w-full min-h-[50px] relative">
            <div id="welcome-google-btn" className="w-full flex justify-center"></div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
            Acceso autorizado para investigadores y auditores territoriales.
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PANEL PRINCIPAL (AUTENTICADO)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} user={user} setUser={setUser} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner de Radar */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
              <Radar className="w-3.5 h-3.5 animate-spin" /> Monitoreo Espacial Activo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Centro de Inteligencia Territorial</h2>
            <p className="mt-2 text-blue-100 text-xs sm:text-sm">
              Plataforma satelital de detección y análisis de anomalías en Colombia y el mundo.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex justify-center">
            <button
              onClick={handleScanRadar}
              disabled={scanning}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Escaneando...' : 'Escanear Radar Nacional'}</span>
            </button>
          </div>
        </div>

        {/* Resultados del Escaneo Satelital (Desglose Colombia vs Internacional) */}
        {scanResult && (() => {
          const anomalias = scanResult.anomalies || scanResult.data || [];
          
          const colomAnomalies = anomalias.filter(a => {
            const la = parseFloat(a.latitude || 1.2);
            const lo = parseFloat(a.longitude || -77.2);
            return la >= -4.23 && la <= 12.46 && lo >= -79.0 && lo <= -66.85;
          });

          return (
            <div className="mb-8 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Resultados del Análisis Satelital en Tiempo Real
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                  {anomalias.length} totales detectadas
                </span>
              </div>

              {/* Estado en Colombia */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  🇨🇴 Monitoreo en Colombia
                </h4>
                {colomAnomalies.length > 0 ? (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Se han detectado {colomAnomalies.length} anomalías activas en el territorio nacional de Colombia.
                  </p>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>⚠️ En Colombia aún no se detecta ninguna anomalía ni incidente en este ciclo de escaneo.</span>
                  </div>
                )}
              </div>

              {/* Detalle de hasta 5 anomalías internacionales / globales */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  🌍 Informes Globales / Internacionales (Mostrando hasta 5)
                </h4>
                {anomalias.length === 0 ? (
                  <p className="text-xs text-gray-500">No hay datos de radar disponibles actualmente.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {anomalias.slice(0, 5).map((item, index) => {
                      const la = parseFloat(item.latitude || 0);
                      const lo = parseFloat(item.longitude || 0);
                      const esColombia = la >= -4.23 && la <= 12.46 && lo >= -79.0 && lo <= -66.85;
                      const ubicacionTexto = esColombia ? "🇨🇴 Territorio Nacional (Colombia)" : `🌍 Ubicación Global (${la.toFixed(2)}, ${lo.toFixed(2)})`;
                      
                      return (
                        <div key={index} className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                              {item.category || 'Anomalía Detectada'}
                            </span>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white mt-2">
                              {item.title || item.description?.substring(0, 45) + '...' || 'Incidente satelital'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {item.description || 'Sin descripción detallada.'}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-blue-100 dark:border-blue-900/40 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                            {ubicacionTexto}
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

        {/* Grid de Formulario y Reportes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <ReportForm onReportCreated={fetchReports} user={user} />
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 transition-all">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Reportes del Sistema
                </h3>
                <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                  {reports.length} totales
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Cargando reportes en tiempo real...
                </div>
              ) : reports.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No hay reportes registrados aún.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Usa el formulario para ingresar el primer reporte.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{report.title}</h4>
                        <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl whitespace-nowrap">
                          {report.category || 'General'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2 leading-relaxed">{report.description}</p>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                          <MapPin className="w-3.5 h-3.5" />
                          {formatReportLocation(report.latitude, report.longitude)}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">Por: {report.author || 'Anónimo'}</span>
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