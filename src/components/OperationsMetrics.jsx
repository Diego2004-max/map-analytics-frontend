import { Globe2, RadioTower, TrendingUp } from 'lucide-react';

export function OperationsMetrics({ scan, reportStats }) {
  const national = scan?.national || [];
  const international = scan?.international || [];
  const events = [...national, ...international];
  const significant = events.filter((event) => event.magnitude >= 4).length;
  const max = events.reduce((best, event) => !best || event.magnitude > best.magnitude ? event : best, null);
  const cards = [
    { icon: Globe2, label: 'Cobertura geográfica', value: `${national.length} / ${international.length}`, detail: 'Colombia / otros países' },
    { icon: TrendingUp, label: 'Eventos relevantes', value: significant, detail: 'Magnitud igual o superior a 4.0' },
    { icon: RadioTower, label: 'Última lectura', value: scan?.fetchedAt ? new Date(scan.fetchedAt).toLocaleTimeString('es-CO') : 'Pendiente', detail: max ? `Máximo M${max.magnitude.toFixed(1)} · ${max.title}` : 'Sin eventos consultados' }
  ];
  return <section aria-label="Métricas operativas" className="mb-8 grid gap-4 md:grid-cols-3">{cards.map(({ icon: Icon, label, value, detail }) => <article key={label} className="card-lift rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/85"><Icon className="text-blue-600 dark:text-blue-300" size={22}/><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p><p className="mt-1 line-clamp-2 text-xs text-slate-500" title={detail}>{detail}</p></article>)}</section>;
}
