export type Lang = "ta" | "en";
export interface Eligibility {
  status: string;
  matched_rules: string[];
  missing_rules: string[];
  requires_official_verification: boolean;
}
export interface ChatResponse {
  session_id: string;
  reply: string;
  profile: Record<string, string | number | null>;
  current_step: string;
  eligibility: Eligibility | null;
}
export interface Rule { id: string; label_en: string; label_ta: string }
export interface Doc { id: string; name_en: string; name_ta: string; why_en: string; why_ta: string }
export interface Step { id: string; kind: "official" | "demo"; title_en: string; title_ta: string }
export interface Scheme {
  scheme_name: string;
  scheme_name_ta: string;
  description: string;
  description_ta: string;
  official_url: string;
  eligibility_rules: Rule[];
  required_documents: Doc[];
  application_steps: Step[];
}
