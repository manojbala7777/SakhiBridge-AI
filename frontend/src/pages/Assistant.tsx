import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mic, Send, Square } from "lucide-react";
import { usePrefs } from "../context";
import { T, speechLocale } from "../i18n";
import { getScheme, sendChat } from "../services/api";
import { useVoice } from "../hooks/useVoice";
import type { Eligibility, Scheme } from "../types";
import { ListenButton, PrefsBar } from "../components/Controls";
import { ApplicationGuide, DocumentChecklist, EligibilityCard } from "../components/Results";

interface Msg { role: "user" | "assistant"; text: string }

export default function Assistant() {
  const { lang } = usePrefs();
  const t = T[lang];
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [sid, setSid] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [elig, setElig] = useState<Eligibility | null>(null);
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [last, setLast] = useState("");

  useEffect(() => { getScheme("pmuy").then(setScheme).catch(() => setFailed(true)); }, []);

  const send = useCallback(async (text: string) => {
    const clean = text.trim();
    if (!clean || busy) return;
    setBusy(true); setFailed(false); setLast(clean);
    setMsgs((m) => [...m, { role: "user", text: clean }]);
    setInput("");
    try {
      const r = await sendChat(clean, lang, sid);
      setSid(r.session_id);
      setMsgs((m) => [...m, { role: "assistant", text: r.reply }]);
      setElig(r.eligibility);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }, [busy, lang, sid]);

  const voice = useVoice(speechLocale[lang], send);
  const step = elig ? 3 : msgs.length > 0 ? 1 : 0;

  return (
    <main className="page wide">
      <PrefsBar />
      <h1 className="brand sm">SakhiBridge AI</h1>
      <ol className="progress" aria-label="Progress">
        {t.steps.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className={i <= step ? "done" : ""}>{s}</li>
        ))}
      </ol>

      <div className="chat" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <p>{m.text}</p>
            {m.role === "assistant" && <ListenButton text={m.text} />}
          </div>
        ))}
        {busy && <p role="status" className="note">{t.working}</p>}
      </div>

      {(failed || voice.error) && (
        <div role="alert" className="card warn">
          <p>{voice.error ? t.micFail : t.apiFail}</p>
          <div className="row">
            {failed && last && <button type="button" className="btn secondary" onClick={() => void send(last)}>{t.retry}</button>}
            <Link to="/" className="btn ghost">{t.home}</Link>
          </div>
        </div>
      )}

      {elig && scheme && (
        <>
          <EligibilityCard result={elig} scheme={scheme} />
          <DocumentChecklist scheme={scheme} />
          <ApplicationGuide scheme={scheme} />
        </>
      )}

      {msgs.length === 0 && (
        <div className="stack">
          {t.suggestions.map((s) => (
            <button key={s} type="button" className="btn ghost" onClick={() => void send(s)}>{s}</button>
          ))}
        </div>
      )}

      <form className="composer" onSubmit={(e) => { e.preventDefault(); void send(input); }}>
        <button
          type="button"
          className="btn primary mic"
          disabled={!voice.isSupported}
          aria-label={voice.isListening ? t.stop : t.speak}
          onClick={voice.isListening ? voice.stopListening : voice.startListening}
        >
          {voice.isListening ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}
          <span>{voice.isListening ? t.listening : t.speak}</span>
        </button>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} aria-label={t.write} maxLength={500} />
        <button type="submit" className="btn secondary" aria-label={t.send} disabled={busy}><Send aria-hidden="true" /></button>
      </form>
    </main>
  );
}
