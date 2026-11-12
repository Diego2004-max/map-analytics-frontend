import { CircleStop, Mic } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function VoiceRecorder({ onRecorded, disabled }) {
  const recorder = useRef(null);
  const stream = useRef(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const start = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return setError('Este navegador no admite grabación de audio.');
    try {
      const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = microphone;
      const mimeType = ['audio/webm', 'audio/ogg'].find((type) => MediaRecorder.isTypeSupported(type));
      const mediaRecorder = new MediaRecorder(microphone, mimeType ? { mimeType } : undefined);
      recorder.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      mediaRecorder.onstop = () => {
        microphone.getTracks().forEach((track) => track.stop());
        stream.current = null;
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
        if (blob.size > 8 * 1024 * 1024) return setError('La grabación supera 8 MB. Graba un mensaje más corto.');
        if (blob.size) onRecorded(new File([blob], `grabacion-${Date.now()}.${mediaRecorder.mimeType.includes('ogg') ? 'ogg' : 'webm'}`, { type: mediaRecorder.mimeType }));
      };
      mediaRecorder.start(); setRecording(true);
    } catch { setError('No se pudo acceder al micrófono. Revisa el permiso del navegador.'); }
  };
  const stop = () => { recorder.current?.stop(); setRecording(false); };
  return <div><button type="button" disabled={disabled && !recording} onClick={recording ? stop : start} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${recording ? 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/40' : 'border-slate-300 dark:border-slate-700'}`}>{recording ? <><CircleStop size={17}/>Detener y adjuntar grabación</> : <><Mic size={17}/>Grabar audio ahora</>}</button>{error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}</div>;
}
