import { Crosshair, ImagePlus, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { api } from '../lib/api';
import { VoiceRecorder } from './VoiceRecorder';

export function ReportForm({ onReportCreated }) {
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const fileSummary = useMemo(() => files.map((file) => ({ name: file.name, type: file.type.startsWith('image/') ? 'Imagen' : 'Audio' })), [files]);

  const locate = () => {
    if (!navigator.geolocation) return setError('Tu navegador no admite geolocalización.');
    setIsLocating(true); setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => { setLatitude(position.coords.latitude.toFixed(6)); setLongitude(position.coords.longitude.toFixed(6)); setIsLocating(false); },
      () => { setError('No fue posible obtener tu ubicación. Revisa los permisos del navegador.'); setIsLocating(false); },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 }
    );
  };
  const selectFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.some((file) => file.size > 8 * 1024 * 1024)) return setError('Cada archivo debe pesar máximo 8 MB.');
    setFiles((current) => [...current, ...selected].slice(0, 4)); event.target.value = '';
  };
  const submit = async (event) => {
    event.preventDefault(); setIsSubmitting(true); setError('');
    try { const result = await api.createReport({ description, latitude: Number(latitude), longitude: Number(longitude), citizenId: 'ANONYMOUS', attachments: files }); setDescription(''); setFiles([]); onReportCreated(result.data); }
    catch (requestError) { setError(requestError.name === 'TimeoutError' ? 'El servidor tardó demasiado. Intenta nuevamente.' : requestError.message); } finally { setIsSubmitting(false); }
  };
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold">Registrar fenómeno</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Describe el hecho y adjunta evidencia opcional.</p></div><button type="button" onClick={locate} disabled={isLocating} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50 dark:border-blue-900 dark:text-blue-300"><Crosshair size={16}/>{isLocating ? 'Ubicando…' : 'Usar mi GPS'}</button></div>
    {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
    <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-semibold">Descripción<textarea required minLength="10" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ej.: Deslizamiento junto a la vía principal" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-transparent p-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:ring-blue-950" rows="4"/></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Latitud<input required type="number" step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-transparent p-3 outline-none focus:border-blue-600 dark:border-slate-700"/></label><label className="text-sm font-semibold">Longitud<input required type="number" step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-transparent p-3 outline-none focus:border-blue-600 dark:border-slate-700"/></label></div>
      <div><p className="mb-2 text-sm font-semibold">Evidencia <span className="font-normal text-slate-500">(opcional, máximo 4 archivos)</span></p><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><ImagePlus size={17}/>Añadir imágenes<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectFiles}/></label><div className="mt-2"><VoiceRecorder disabled={files.length >= 4} onRecorded={(file) => setFiles((current) => current.length < 4 ? [...current, file] : current)}/></div>{fileSummary.length > 0 && <ul className="mt-2 space-y-2">{fileSummary.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800"><span className="truncate">{file.type}: {file.name}</span><button type="button" onClick={() => setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index))} aria-label={`Quitar ${file.name}`}><X size={16}/></button></li>)}</ul>}</div>
      <button disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"><Send size={17}/>{isSubmitting ? 'Guardando reporte…' : 'Analizar y registrar'}</button></form>
  </section>;
}
