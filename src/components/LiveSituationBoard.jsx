import { useMemo } from 'react';
import { BarChart3, Globe2, ShieldAlert, TimerReset } from 'lucide-react';

const card = 'rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/85';

export function LiveSituationBoard({ scan, reportStats, health }) {
  const events = useMemo(() => [...(scan?.national || []), ...(scan?.international || [])], [scan]);
  const hourly = useMemo(() => {
    const counts = Array.from({ length: 6 }, (_, index) => ({ label: `${5 - index}h`, value: 0 }));
    const now = Date.now();
    events.forEach((event) => { const age = Math.floor((now - Date.parse(event.timestamp)) / 3_600_000); if (age >= 0 && age < 6) counts[5 - age].value += 1; });
    return counts;
  }, [events]);
  const peak = Math.max(1, ...hourly.map((item) => item.value));
  const high = reportStats?.high || 0;
  const medium = reportStats?.medium || 0;
  return <section aria-label="Tablero de situación en tiempo real" className="mb-8 space-y-4">
    <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-300">Situación en vivo</p><h2 className="mt-1 text-2xl font-bold">Tablero para operadores</h2><p className="mt-1 text-sm text-slate-500">Lectura consolidada de actividad sísmica, reportes y prioridades.</p></div><span className="text-xs text-slate-500">{health?.timestamp ? new Date(health.timestamp).toLocaleTimeString('es-CO') : 'Sin sincronizar'}</span></div>
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
      <article className={card}><div className="flex items-center justify-between"><div><h3 className="font-bold">Actividad reciente</h3><p className="text-xs text-slate-500">Eventos detectados por ventana de 3 horas</p></div><BarChart3 className="text-blue-600" size={20}/></div><div className="mt-6 flex h-32 items-end gap-3">{hourly.map((item) => <div key={item.label} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-blue-500/80 transition-all dark:bg-blue-400/70" style={{ height: `${Math.max(8, item.value / peak * 100)}%` }} title={`${item.value} eventos`}/><span className="text-xs text-slate-500">{item.label}</span></div>)}</div></article>
      <article className={card}><div className="flex items-center gap-2"><Globe2 className="text-cyan-600" size={20}/><h3 className="font-bold">Cobertura</h3></div><p className="mt-4 text-3xl font-black">{scan?.national?.length || 0}</p><p className="text-sm text-slate-500">eventos en Colombia</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-cyan-500" style={{ width: `${events.length ? Math.min(100, (scan?.national?.length || 0) / events.length * 100) : 0}%` }}/></div><p className="mt-2 text-xs text-slate-500">{scan?.international?.length || 0} internacionales</p></article>
      <article className={card}><div className="flex items-center gap-2"><ShieldAlert className="text-violet-600" size={20}/><h3 className="font-bold">Prioridad comunitaria</h3></div><div className="mt-4 grid grid-cols-2 gap-3"><div><p className="text-2xl font-black text-red-500">{high}</p><p className="text-xs text-slate-500">Alta</p></div><div><p className="text-2xl font-black text-amber-500">{medium}</p><p className="text-xs text-slate-500">Media</p></div></div><div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><TimerReset size={14}/> Retención: 1 hora</div></article>
    </div>
  </section>;
}
