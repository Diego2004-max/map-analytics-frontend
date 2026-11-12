import { useState } from 'react';
import { api } from '../lib/api';
export function CommunityReports({ reports, user, onDeleted }) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  async function remove(id) {
    if (!window.confirm('¿Eliminar este reporte y sus archivos permanentemente?')) return;
    setBusy(id); setError('');
    try { await api.deleteReport(id); onDeleted(id); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(null); }
  }
  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
    <h2 className="text-xl font-bold">Panel de reportes comunitarios</h2>
    <p className="my-3 text-sm text-slate-500">Reportes recientes cargados. Caducan al cumplir una hora; solo puedes borrar manualmente los que creaste.</p>
    {error && <p role="alert" className="text-red-500">{error}</p>}
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{reports.map(report => <article key={report.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <h3 className="font-semibold">{report.category}</h3><p className="my-2 break-words text-sm">{report.description}</p>
      <time className="text-xs text-slate-500">{new Date(report.created_at).toLocaleString('es-CO')}</time>
      {Number(report.owner_id) === Number(user.id) && <button disabled={busy !== null} onClick={() => remove(report.id)} className="mt-3 block rounded-lg border border-red-400 px-3 py-2 text-sm text-red-500 disabled:opacity-50">{busy === report.id ? 'Eliminando…' : 'Eliminar mi reporte'}</button>}
    </article>)}</div>
    {!reports.length && <p className="py-6">No hay reportes activos.</p>}
  </section>;
}
