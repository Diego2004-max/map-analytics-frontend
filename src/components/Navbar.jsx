import React from 'react';
import { Sun, Moon, MapPin, Activity } from 'lucide-react';

export function Navbar({ darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              Map Analytic <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">AI</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Plataforma de Inteligencia Espacial y Monitoreo</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Sistema Operativo (Render Cloud)</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700 shadow-sm"
            aria-label="Cambiar modo oscuro"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}