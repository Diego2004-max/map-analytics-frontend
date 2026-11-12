import { useMemo, useState } from 'react';
import { SeismicExplorer } from './SeismicExplorer';

const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900';

export function AnalyticsPanel({ reports, scan, loading, scanning }) {
  const [region, setRegion] = useState('all');
  const events = useMemo(() => region === 'national' ? (scan?.national || []) : region === 'international' ? (scan?.international || []) : [...(scan?.national || []), ...(scan?.international || [])], [scan, region]);
  const magnitudes = [0, 3, 4, 5, 6].map((min, index, bounds) => ({ label: index === 4 ? '6 o más' : `${min}–${bounds[index + 1]}`, value: events.filter((event) => event.magnitude >= min && (index === 4 || event.magnitude < bounds[index + 1])).length }));
  const severities = [{ label: 'Alta', key: 'HIGH' }, { label: 'Media', key: 'MEDIUM' }, { label: 'Baja', key: 'LOW' }].map(({ label, key }) => ({ label, value: reports.filter((report) => report.severity === key).length }));
  const categories = Object.entries(reports.reduce((counts, report) => { counts[report.category] = (counts[report.category] || 0) + 1; return counts; }, {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  const maximumEvent = events.length ? events.reduce((best, event) => event.magnitude > best.magnitude ? event : best, events[0]) : null;
  const maximum = maximumEvent ? maximumEvent.magnitude.toFixed(1) : '—';
  return <section className="mb-8 space-y-4" aria-label="Panel de análisis territorial">
    {scanning && <p role="status" className="animate-pulse rounded-xl bg-blue-100 px-4 py-2 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">Actualizando actividad sísmica…</p>}
    {scan && <SeismicExplorer events={events}/>}
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Panorama territorial</p><h2 className="mt-1 text-2xl font-bold">Lo que está pasando</h2><p className="mt-1 text-sm text-slate-500">Análisis de los registros cargados. Radar: últimas 24 horas; comunidad: hasta 100 reportes recientes.</p></div><label className="text-sm">Región del radar<select value={region} onChange={(event) => setRegion(event.target.value)} className="ml-2 rounded-xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"><option value="all">Todas</option><option value="national">Colombia</option><option value="international">Otros países</option></select></label></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[['Sismos consultados', scan ? events.length : '—'], ['Magnitud máxima', maximum], ['Reportes comunitarios', loading ? '…' : reports.length], ['Prioridad alta', loading ? '…' : severities[0].value]].map(([label, value], index) => <div key={label} className={`${panel} ${index === 0 ? 'border-blue-400 dark:border-blue-700' : ''}`}><p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-3xl font-black tabular-nums">{value}</p>{label === 'Magnitud máxima' && maximumEvent && <p className="mt-1 line-clamp-2 text-xs text-slate-500" title={maximumEvent.title}>{maximumEvent.title}</p>}</div>)}</div>
    <div className="grid gap-4 lg:grid-cols-3"><div className={panel}><h3 className="font-bold">Magnitud de los sismos</h3><p className="mb-5 mt-1 text-xs text-slate-500">Cantidad por intervalo de magnitud</p>{scan ? <Bars rows={magnitudes} color="bg-blue-600"/> : <Empty>Escanea el radar para visualizar los sismos.</Empty>}</div><div className={panel}><h3 className="font-bold">Prioridad de los reportes</h3><p className="mb-5 mt-1 text-xs text-slate-500">Clasificación de reportes comunitarios</p>{loading ? <Empty>Cargando reportes…</Empty> : <Bars rows={severities} color="bg-violet-500"/>}</div><div className={panel}><h3 className="font-bold">Fenómenos registrados</h3><p className="mb-5 mt-1 text-xs text-slate-500">Distribución por categoría</p>{loading ? <Empty>Cargando reportes…</Empty> : <Bars rows={categories} color="bg-emerald-500"/>}</div></div>
    {scan && <p className="text-xs text-slate-500">Radar actualizado: {new Date(scan.fetchedAt).toLocaleString('es-CO')}. Las gráficas representan los eventos mostrados, no el total mundial.</p>}
  </section>;
}

function Bars({ rows, color }) {
  const maximum = Math.max(1, ...rows.map((row) => row.value));
  if (!rows.some((row) => row.value)) return <Empty>Sin registros para esta selección.</Empty>;
  return <ul className="max-h-52 space-y-4 overflow-y-auto">{rows.map(({ label, value }) => <li key={label}><div className="mb-1 flex justify-between gap-3 text-xs"><span>{label}</span><b className="tabular-nums">{value}</b></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true"><div className={`h-full rounded-full ${color}`} style={{ width: `${value / maximum * 100}%` }}/></div></li>)}</ul>;
}
function Empty({ children }) { return <p className="py-8 text-center text-sm text-slate-500">{children}</p>; }
