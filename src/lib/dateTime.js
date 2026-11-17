const locale = 'es-CO';

export function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : date.toLocaleString(locale);
}

export function formatTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Sin sincronizar' : date.toLocaleTimeString(locale);
}
