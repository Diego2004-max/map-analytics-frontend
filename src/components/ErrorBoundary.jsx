import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-white"><div><h1 className="text-2xl font-bold">No pudimos cargar el panel</h1><p className="mt-2 text-slate-300">Recarga la página para intentar nuevamente.</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500">Recargar</button></div></main>;
  }
}
