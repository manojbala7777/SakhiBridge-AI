import { useEffect, useState } from "react";
import { Info, Sparkles, Volume2 } from "lucide-react";
import { usePrefs } from "../context";
import { T, speechLocale } from "../i18n";
import { speak } from "../utils/speak";
import { SchemeModal } from "./SchemeModal";

export function PrefsBar() {
  const { lang, setLang } = usePrefs();
  const t = T[lang];
  const [noteIndex, setNoteIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notes = t.schemeNotes;

  useEffect(() => {
    const timer = setInterval(() => {
      setNoteIndex((prev) => (prev + 1) % notes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [notes.length]);

  return (
    <>
      <div className="prefs">
        <label>
          <span className="sr">Language</span>
          <select value={lang} onChange={(e) => setLang(e.target.value === "en" ? "en" : "ta")} aria-label="Language">
            <option value="ta">தமிழ்</option>
            <option value="en">English</option>
          </select>
        </label>
        <button
          type="button"
          className="scheme-ticker"
          onClick={() => setIsModalOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isModalOpen}
          aria-label={t.schemeModal.clickForMore}
          title={t.schemeModal.clickForMore}
        >
          <span className="scheme-badge">
            <Sparkles size={14} aria-hidden="true" />
            {t.schemeBadge}
          </span>
          <div className="scheme-notes-track">
            <span key={`${lang}-${noteIndex}`} className="scheme-note-text">
              {notes[noteIndex]}
            </span>
          </div>
          <span className="scheme-expand-badge" aria-hidden="true">
            <Info size={15} />
          </span>
        </button>
      </div>

      <SchemeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export function ListenButton({ text }: { text: string }) {
  const { lang } = usePrefs();
  return (
    <button type="button" className="btn ghost" onClick={() => speak(text, speechLocale[lang])} aria-label={`${T[lang].listen}`}>
      <Volume2 aria-hidden="true" /> {T[lang].listen}
    </button>
  );
}
