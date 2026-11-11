import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function GoogleSignIn({ onAuthenticated }) {
  const container = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!clientId) { setError('Falta configurar VITE_GOOGLE_CLIENT_ID para habilitar el acceso institucional.'); return undefined; }
    const render = () => {
      window.google.accounts.id.initialize({ client_id: clientId, callback: async ({ credential }) => {
        try { const result = await api.verifyGoogleCredential(credential); onAuthenticated(result.data); }
        catch (requestError) { setError(requestError.message); }
      }});
      window.google.accounts.id.renderButton(container.current, { theme: 'outline', size: 'large', text: 'signin_with', locale: 'es' });
    };
    const current = document.querySelector('script[data-google-identity]');
    if (window.google) render();
    else if (current) current.addEventListener('load', render, { once: true });
    else { const script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.dataset.googleIdentity = 'true'; script.addEventListener('load', render, { once: true }); document.head.append(script); }
    return undefined;
  }, [onAuthenticated]);
  return <><div ref={container} className="mt-6 flex justify-center"/>{error && <p role="alert" className="mt-4 text-center text-sm text-red-300">{error}</p>}</>;
}
