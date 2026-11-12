import { useMemo, useState } from 'react';

export function SeismicExplorer({ events }) {
  const [minimum, setMinimum] = useState(0);
  const [selected, setSelected] = useState(null);
  const visible = useMemo(() => events.filter((event) => event.magnitude >= minimum).sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)), [events, minimum]);
  const active = visible.find((event) => event.id === selected);
  const start = visible.length ? Date.parse(visible[0].timestamp) : 0;
  const duration = Math.max(1, visible.length ? Date.parse(visible[visible.length - 1].timestamp) - start : 1);
  const ceiling = Math.max(6, ...visible.map((event) => event.magnitude));
  return <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-bold">Pulso sísmico</h3><p className="text-xs text-slate-500">Selecciona un punto para explorar el evento. Eje vertical: magnitud.</p></div><label className="flex items-center gap-3 text-sm">Magnitud mínima <input aria-label="Magnitud mínima" type="range" min="0" max="7" step="0.5" value={minimum} onChange={(event) => setMinimum(Number(event.target.value))}/><b className="w-8">{minimum.toFixed(1)}</b></label></div>
    {visible.length ? <><svg viewBox="0 0 800 200" className="mt-4 w-full" style={{ maxHeight: 230 }} role="group" aria-label="Eventos por hora y magnitud">{[0, 2, 4, 6].map((tick) => <g key={tick}><line x1="30" x2="780" y1={170 - tick / ceiling * 140} y2={170 - tick / ceiling * 140} stroke="currentColor" opacity="0.1"/><text x="5" y={174 - tick / ceiling * 140} fill="currentColor" fontSize="11">{tick}</text></g>)}{visible.map((event) => <circle key={event.id} cx={40 + (Date.parse(event.timestamp) - start) / duration * 720} cy={170 - event.magnitude / ceiling * 140} r={selected === event.id ? 8 : 5} fill={event.magnitude >= 5 ? '#f97316' : '#2563eb'} opacity="0.8" tabIndex="0" role="button" aria-label={`${event.title}, magnitud ${event.magnitude}`} onClick={() => setSelected(event.id)} onKeyDown={(key) => { if (key.key === 'Enter' || key.key === ' ') { key.preventDefault(); setSelected(event.id); } }}><title>{event.title}: M{event.magnitude}</title></circle>)}</svg><div className="flex justify-between text-xs text-slate-500"><span>{new Date(start).toLocaleTimeString('es-CO')}</span><span>{visible.length} eventos</span><span>{new Date(start + duration).toLocaleTimeString('es-CO')}</span></div></> : <p className="py-10 text-center text-sm text-slate-500">Sin eventos para este filtro.</p>}
    {active && <div className="mt-4 rounded-xl bg-blue-100 p-4 text-sm dark:bg-blue-950"><b>{active.title}</b><p className="mt-1">Magnitud {active.magnitude} · {new Date(active.timestamp).toLocaleString('es-CO')} · {active.latitude.toFixed(3)}, {active.longitude.toFixed(3)}</p></div>}
  </div>;
}
