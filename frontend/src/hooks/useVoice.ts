import { useCallback, useRef, useState } from "react";

interface RecogEvent { results: ArrayLike<ArrayLike<{ transcript: string }>> }
interface Recog {
  lang: string;
  interimResults: boolean;
  onresult: ((e: RecogEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type RecogCtor = new () => Recog;
const w = window as unknown as { SpeechRecognition?: RecogCtor; webkitSpeechRecognition?: RecogCtor };
const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;

export function useVoice(lang: string, onFinal: (text: string) => void) {
  const [isListening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(false);
  const ref = useRef<Recog | null>(null);
  const isSupported = Ctor !== undefined;

  const startListening = useCallback(() => {
    if (!Ctor) { setError(true); return; }
    setError(false);
    setTranscript("");
    const r = new Ctor();
    r.lang = lang;
    r.interimResults = false;
    r.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      setTranscript(text);
      if (text) onFinal(text);
    };
    r.onerror = () => { setError(true); setListening(false); };
    r.onend = () => setListening(false);
    ref.current = r;
    try { r.start(); setListening(true); } catch { setError(true); }
  }, [lang, onFinal]);

  const stopListening = useCallback(() => { ref.current?.stop(); setListening(false); }, []);
  return { startListening, stopListening, isListening, transcript, error, isSupported };
}
