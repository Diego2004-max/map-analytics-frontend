import React, { useState } from 'react';
import { Send, Sparkles, Navigation, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function ReportForm({ onReportCreated, user }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sismo / Geológico',
    latitude: '1.204265',
    longitude: '-77.295042'
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Detección dinámica: Colombia vs Internacional en pantalla
  const getUbicacionTexto = (lat, lon) => {
    const la = parseFloat(lat);
    const lo = parseFloat(lon);
    const enColombia = la >= -4.5 && la <= 13.5 && lo >= -79.0 && lo <= -66.8;
    if (enColombia) {
      if (la >= 1.0 && la <= 1.5 && lo >= -77.5 && lo <= -77.0) return "📍 Pasto, Nariño (Colombia)";
      if (la >= 4.5 && la <= 5.0 && lo >= -74.5 && lo <= -74.0) return "📍 Bogotá D.C. (Colombia)";
      return "📍 Detectado en Territorio Nacional (Colombia)";
    }
    return `📍 Ubicación Internacional (${la.toFixed(2)}, ${lo.toFixed(2)})`;
  };

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        }));
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Por favor inicia sesión con tu cuenta de Google para registrar la anomalía.');
      return;
    }
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          author: user.email
        })
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setSuccessMsg('¡Anomalía registrada y clasificada con IA con éxito!');
        setFormData({ title: '', description: '', category: 'Sismo / Geológico', latitude: '1.204265', longitude: '-77.295042' });
        onReportCreated();
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-700 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Registrar Anomalía</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Clasificación inteligente con Gemini AI.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGPS}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Usar mi GPS</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-medium">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
            Título del Reporte
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Anomalía geológica en vía..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <option value="Sismo / Geológico">Sismo / Geológico</option>
              <option value="Climatológico">Climatológico</option>
              <option value="Infraestructura Vial">Infraestructura Vial</option>
              <option value="Seguridad / Orden Público">Seguridad / Orden Público</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">Lat.</label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">Lon.</label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{getUbicacionTexto(formData.latitude, formData.longitude)}</span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
            Descripción Detallada
          </label>
          <textarea
            required
            rows="3"
            placeholder="Describa los detalles..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 text-sm"
        >
          {loading ? (
            <span>Analizando y Registrando...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Analizar con IA y Registrar</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}