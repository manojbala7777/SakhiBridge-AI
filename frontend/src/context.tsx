import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "./types";

interface Prefs {
  lang: Lang;
  setLang: (l: Lang) => void;
  simple: boolean;
  setSimple: (v: boolean) => void;
}
const Ctx = createContext<Prefs | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ta");
  const [simple, setSimple] = useState(false);
  const value = useMemo(() => ({ lang, setLang, simple, setSimple }), [lang, simple]);
  return (
    <Ctx.Provider value={value}>
      <div className={simple ? "simple" : ""} lang={lang}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function usePrefs(): Prefs {
  const v = useContext(Ctx);
  if (!v) throw new Error("PrefsProvider missing");
  return v;
}
