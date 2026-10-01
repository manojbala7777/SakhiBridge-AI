import { Link } from "react-router-dom";
import { Mic, PenLine } from "lucide-react";
import { usePrefs } from "../context";
import { T } from "../i18n";
import { ListenButton, PrefsBar } from "../components/Controls";

export default function Home() {
  const { lang } = usePrefs();
  const t = T[lang];
  return (
    <main className="page">
      <PrefsBar />
      <h1 className="brand">SakhiBridge AI</h1>
      <p className="lead">{t.hero}</p>
      <p className="sr">{t.tagline}</p>
      <div className="stack">
        <Link to="/assistant?mode=voice" className="btn primary big"><Mic aria-hidden="true" /> {t.speak}</Link>
        <Link to="/assistant" className="btn secondary big"><PenLine aria-hidden="true" /> {t.write}</Link>
        <ListenButton text={t.hero} />
        <Link to="/help" className="btn ghost">?</Link>
      </div>
    </main>
  );
}
