import { ArrowRight, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api';
import { GoogleSignIn } from './GoogleSignIn';

export function AuthCard({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const result = mode === 'login' ? await api.login(email, password) : await api.register(name, email, password);
      onAuthenticated(result.data);
    } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  };

  return <section className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/15 bg-slate-900/85 shadow-2xl shadow-blue-950/50 backdrop-blur-xl">
    <div className="border-b border-white/10 bg-gradient-to-br from-blue-700 to-indigo-800 px-7 pb-7 pt-8 text-center">
      <span className="mx-auto inline-flex rounded-2xl bg-white/15 p-3 text-white ring-1 ring-white/25"><ShieldCheck size={27}/></span>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Acceso seguro</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Map Analytic AI</h1>
      <p className="mt-2 text-sm leading-6 text-blue-100">Analiza, reporta y monitorea el territorio desde un solo lugar.</p>
    </div>
    <div className="p-6 sm:p-7">
      <div className="grid grid-cols-2 rounded-xl bg-slate-800 p-1 text-sm" role="tablist">
        <button type="button" onClick={() => { setMode('login'); setError(''); }} className={`rounded-lg py-2.5 font-semibold transition ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}>Iniciar sesión</button>
        <button type="button" onClick={() => { setMode('register'); setError(''); }} className={`rounded-lg py-2.5 font-semibold transition ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}>Crear cuenta</button>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === 'register' && <Field icon={<UserRound size={17}/>} label="Nombre completo"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" autoComplete="name" className="w-full bg-transparent py-3 text-slate-100 outline-none placeholder:text-slate-500" /></Field>}
        <Field icon={<Mail size={17}/>} label="Correo electrónico"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@correo.com" autoComplete="email" className="w-full bg-transparent py-3 text-slate-100 outline-none placeholder:text-slate-500" /></Field>
        <Field icon={<KeyRound size={17}/>} label="Contraseña"><input required minLength="10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 10 caracteres" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="w-full bg-transparent py-3 text-slate-100 outline-none placeholder:text-slate-500" /></Field>
        {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}
        <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Procesando…' : mode === 'login' ? 'Entrar a la plataforma' : 'Crear mi cuenta'}<ArrowRight size={18}/></button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-700"/>o continúa con<span className="h-px flex-1 bg-slate-700"/></div>
      <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"><GoogleSignIn onAuthenticated={onAuthenticated}/></div>
    </div>
  </section>;
}

function Field({ icon, label, children }) {
  return <label className="block text-sm font-medium text-slate-200"><span className="mb-1.5 block">{label}</span><span className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/50 px-3 text-slate-400 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20">{icon}{children}</span></label>;
}
