import { Globe2, Radio, ShieldCheck } from 'lucide-react';
import { AuthCard } from './AuthCard';

export function AuthExperience({ onAuthenticated, dark }) {
  return <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-2xl backdrop-blur lg:grid-cols-[.9fr_1.1fr] dark:border-slate-700 dark:bg-slate-900/90">
    <aside className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-12 text-white lg:flex lg:flex-col lg:justify-between"><div><span className="inline-flex rounded-2xl bg-cyan-400/15 p-3 text-cyan-200 ring-1 ring-cyan-300/20"><Globe2/></span><h1 className="mt-8 text-4xl font-black leading-tight">Inteligencia territorial para decisiones oportunas.</h1><p className="mt-4 max-w-md text-slate-300">Monitorea actividad sísmica, registra evidencia comunitaria y consulta el estado operativo en un solo lugar.</p></div><div className="grid grid-cols-2 gap-3 text-sm"><span className="rounded-xl bg-white/5 p-4"><Radio className="mb-2 text-cyan-300"/>Radar en tiempo real</span><span className="rounded-xl bg-white/5 p-4"><ShieldCheck className="mb-2 text-cyan-300"/>Acceso protegido</span></div></aside>
    <div className="grid place-items-center p-4 sm:p-8"><AuthCard onAuthenticated={onAuthenticated} dark={dark}/></div>
  </div>;
}
