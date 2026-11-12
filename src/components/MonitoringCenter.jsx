import { Activity, Clock3, Database, Radio, ShieldCheck } from 'lucide-react';

const statusText = { online: 'Operativo', degraded: 'Degradado', offline: 'Sin conexión', checking: 'Verificando' };

export function MonitoringCenter({ health, serviceStatus, scan, reports, reportStats, onEnableAlerts }) {
  const events = (scan?.national?.length || 0) + (scan?.international?.length || 0);
  const items = [
    { icon: Activity, label: 'API principal', value: statusText[serviceStatus], tone: serviceStatus === 'online' ? 'text-cyan-600 dark:text-cyan-300' : 'text-amber-600' },
    { icon: Database, label: 'Base de datos', value: health?.database === 'ready' ? 'Disponible' : 'Verificando', tone: 'text-sky-600 dark:text-sky-300' },
    { icon: Radio, label: 'Eventos sísmicos', value: scan ? `${events} detectados` : 'Consultando', tone: 'text-indigo-600 dark:text-indigo-300' },
    { icon: ShieldCheck, label: 'Reportes activos', value: `${reportStats?.total ?? reports.length} vigentes`, tone: 'text-violet-600 dark:text-violet-300' }
  ];
  return <section aria-label="Centro de monitoreo" className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-700 dark:text-cyan-300">Operación en vivo</p><h2 className="mt-1 text-xl font-bold">Centro de monitoreo territorial</h2></div><div className="flex items-center gap-2"><button type="button" onClick={onEnableAlerts} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">Activar alertas Colombia</button><span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs dark:bg-slate-800"><Clock3 size={14}/>{health?.latencyMs != null ? `${health.latencyMs} ms` : 'Conectando'}</span></div></div>
    <div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-4 dark:bg-slate-700">{items.map(({ icon: Icon, label, value, tone }) => <article key={label} className="bg-white p-5 dark:bg-slate-900"><Icon className={tone} size={22}/><p className="mt-3 text-xs text-slate-500">{label}</p><p className="mt-1 font-bold">{value}</p></article>)}</div>
    <div className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-3 text-xs text-slate-500"><span>Retención automática: 1 hora</span><span>Última limpieza: {health?.retention?.timestamp ? new Date(health.retention.timestamp).toLocaleTimeString('es-CO') : 'pendiente'}</span><span>Eliminados: {health?.retention?.deleted ?? 0}</span></div>
  </section>;
}
