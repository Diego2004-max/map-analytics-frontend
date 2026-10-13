import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;

  useEffect(() => {
    // Inicializar Google Sign-In real con tu Client ID
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "756822032174-lb6mm8kg6qasoabcdhdvuq4lufi8uhh0.apps.googleusercontent.com",
        callback: (response) => {
          // Decodificar el JWT token real que devuelve Google
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const googleUser = JSON.parse(jsonPayload);
          onLogin({
            name: googleUser.name,
            email: googleUser.email,
            avatar: googleUser.picture
          });
          onClose();
        }
      });

      // Renderizar el botón oficial de Google de forma limpia
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Autenticación Google</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Inicia sesión de forma real con tu cuenta institucional o personal de Google/Gmail.</p>
        </div>

        {/* Contenedor del botón oficial de Google */}
        <div id="google-signin-btn" className="flex justify-center w-full min-h-[40px]"></div>
      </div>
    </div>
  );
}