import { Link } from "react-router-dom";
import { usePrefs } from "../context";
import { T } from "../i18n";
import { ListenButton, PrefsBar } from "../components/Controls";

export default function Help() {
  const { lang } = usePrefs();
  const t = T[lang];
  return (
    <main className="page">
      <PrefsBar />
      <h1>{t.helpTitle}</h1>
      <ul className="plain">{t.helpBody.map((l) => <li key={l}>{l}</li>)}</ul>
      <ListenButton text={t.helpBody.join(" ")} />
      <Link to="/" className="btn secondary big">{t.home}</Link>
    </main>
  );
}
