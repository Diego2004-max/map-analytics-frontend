import { Crosshair, Send } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api';

export function ReportForm({ onReportCreated }) {
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const locate = () => {
    if (!navigator.geolocation) return setError('Tu navegador no admite geolocalización.');
    setIsLocating(true); setError('');
    navigator.geolocation.getCurrentPosition((position) => { setLatitude(position.coords.latitude.toFixed(6)); setLongitude(position.coords.longitude.toFixed(6)); setIsLocating(false); }, () => { setError('No fue posible obtener tu ubicación. Revisa los permisos del navegador.'); setIsLocating(false); }, { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 });
  };
  const submit = async (event) => {
    event.preventDefault(); setIsSubmitting(true); setError('');
    try { const result = await api.createReport({ description, latitude: Number(latitude), longitude: Number(longitude), citizenId: 'ANONYMOUS' }); setDescription(''); onReportCreated(result.data); }
    catch (requestError) { setError(requestError.message); } finally { setIsSubmitting(false); }
  };
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-950 dark:text-white">Registrar anomalía</h2><p className="mt-1 text-sm text-slate-500">El análisis clasifica el reporte antes de almacenarlo.</p></div><button type="button" onClick={locate} disabled={isLocating} className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50 dark:border-blue-900 dark:text-blue-300"><Crosshair size={16}/>{isLocating ? 'Ubicando…' : 'Usar mi GPS'}</button></div>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
    <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Descripción<textarea required minLength="10" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ej.: Deslizamiento junto a la vía principal" className="mt-1 w-full rounded-lg border border-slate-300 bg-transparent p-3 outline-none focus:border-blue-600 dark:border-slate-700" rows="3"/></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Latitud<input required type="number" step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-transparent p-3 outline-none focus:border-blue-600 dark:border-slate-700"/></label><label className="text-sm font-medium">Longitud<input required type="number" step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-transparent p-3 outline-none focus:border-blue-600 dark:border-slate-700"/></label></div><button disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"><Send size={16}/>{isSubmitting ? 'Analizando y guardando…' : 'Analizar y registrar'}</button></form>
  </section>;
}
