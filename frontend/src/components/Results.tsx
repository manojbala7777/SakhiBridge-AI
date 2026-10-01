import { useState } from "react";
import { Check, Circle, ExternalLink, HelpCircle } from "lucide-react";
import { usePrefs } from "../context";
import { T } from "../i18n";
import type { Eligibility, Scheme } from "../types";
import { ListenButton } from "./Controls";

export function EligibilityCard({ result, scheme }: { result: Eligibility; scheme: Scheme }) {
  const { lang } = usePrefs();
  const t = T[lang];
  const label = (id: string) => {
    const r = scheme.eligibility_rules.find((x) => x.id === id);
    return r ? (lang === "ta" ? r.label_ta : r.label_en) : id;
  };
  return (
    <section className="card" aria-labelledby="elig-h">
      <h2 id="elig-h">{t.eligTitle}</h2>
      <p className="status"><strong>{t.status[result.status] ?? result.status}</strong></p>
      <ul className="plain">
        {result.matched_rules.map((id) => <li key={id}><Check aria-hidden="true" /> {label(id)}</li>)}
        {result.missing_rules.map((id) => <li key={id}><HelpCircle aria-hidden="true" /> {label(id)}</li>)}
      </ul>
      <p className="note">{t.notOfficial}</p>
    </section>
  );
}

type DocState = "have" | "missing" | "verify";

export function DocumentChecklist({ scheme }: { scheme: Scheme }) {
  const { lang } = usePrefs();
  const t = T[lang];
  const [state, setState] = useState<Record<string, DocState>>({});
  const icon = { have: <Check aria-hidden="true" />, missing: <Circle aria-hidden="true" />, verify: <HelpCircle aria-hidden="true" /> };
  const options: DocState[] = ["have", "missing", "verify"];
  return (
    <section className="card" aria-labelledby="docs-h">
      <h2 id="docs-h">{t.docsTitle}</h2>
      {scheme.required_documents.map((d) => {
        const current = state[d.id] ?? "verify";
        const name = lang === "ta" ? d.name_ta : d.name_en;
        const why = lang === "ta" ? d.why_ta : d.why_en;
        return (
          <div key={d.id} className="doc">
            <p>{icon[current]} <strong>{name}</strong></p>
            <p className="note">{why}</p>
            <div className="row" role="group" aria-label={name}>
              {options.map((o) => (
                <button key={o} type="button" className="btn ghost" aria-pressed={current === o} onClick={() => setState({ ...state, [d.id]: o })}>
                  {t[o === "have" ? "have" : o === "missing" ? "missing" : "verify"]}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function ApplicationGuide({ scheme }: { scheme: Scheme }) {
  const { lang } = usePrefs();
  const t = T[lang];
  const title = (s: Scheme["application_steps"][number]) => (lang === "ta" ? s.title_ta : s.title_en);
  return (
    <section className="card" aria-labelledby="guide-h">
      <h2 id="guide-h">{t.guideTitle}</h2>
      <ol className="steps">
        {scheme.application_steps.map((s) => (
          <li key={s.id}>
            {title(s)} <span className="tag">{s.kind === "official" ? t.official : t.demo}</span>
          </li>
        ))}
      </ol>
      <ListenButton text={scheme.application_steps.map(title).join(". ")} />
      <a className="btn primary big" href={scheme.official_url} target="_blank" rel="noopener noreferrer">
        <ExternalLink aria-hidden="true" /> {t.openSite}
      </a>
    </section>
  );
}
