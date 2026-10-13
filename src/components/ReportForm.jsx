import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function ReportForm({ onReportCreated }) {
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('1.204265');
  const [longitude, setLongitude] = useState('-77.295042');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleGetGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
        },
        (err) => {
          alert('No se pudo obtener la ubicación GPS: ' + err.message);
        }
      );
    } else {
      alert('La geolocalización no es compatible con este navegador.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el reporte');
      }

      setDescription('');
      if (onReportCreated) {
        onReportCreated(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📝</span> Registrar Anomalía
          </h3>
          <p className="text-xs text-slate-400">Gemini clasifica automáticamente la anomalía en tiempo real.</p>
        </div>
        <button
          type="button"
          onClick={handleGetGPS}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700 transition-colors flex items-center gap-1"
        >
          <span>📍</span> Usar mi GPS
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-950/50 border border-red-800 text-red-300 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Descripción de la Anomalía</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Sismo fuerte sentido en la región, deslizamiento de tierra en vía principal..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Latitud</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Longitud</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20 text-sm disabled:opacity-50"
        >
          {submitting ? 'Analizando con Gemini y Registrando...' : 'Analizar con IA y Registrar'}
        </button>
      </form>
    </div>
  );
}