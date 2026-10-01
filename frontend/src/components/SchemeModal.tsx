import { useEffect } from "react";
import {
  X,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  Flame,
  ShieldCheck,
  ArrowRight,
  Volume2
} from "lucide-react";
import { usePrefs } from "../context";
import { T, speechLocale } from "../i18n";
import { speak } from "../utils/speak";

interface SchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchemeModal({ isOpen, onClose }: SchemeModalProps) {
  const { lang } = usePrefs();
  const t = T[lang];
  const m = t.schemeModal;

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const audioSummary = `${m.name}. ${m.desc}. ${m.benefitsTitle}: ${m.benefits.join(". ")}`;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scheme-modal-title"
      onClick={onClose}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">
              <Sparkles size={14} aria-hidden="true" />
              {m.badge}
            </span>
            <h2 id="scheme-modal-title" className="modal-title">
              <Flame className="modal-flame-icon" size={24} aria-hidden="true" />
              {m.name}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={m.close}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Overview Banner */}
          <div className="modal-overview-card">
            <p className="modal-desc">{m.desc}</p>
            <button
              type="button"
              className="modal-listen-btn"
              onClick={() => speak(audioSummary, speechLocale[lang])}
              aria-label={t.listen}
            >
              <Volume2 size={16} aria-hidden="true" />
              <span>{t.listen}</span>
            </button>
          </div>

          {/* Section: Key Benefits */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Sparkles size={18} className="icon-secondary" aria-hidden="true" />
              {m.benefitsTitle}
            </h3>
            <ul className="modal-list-benefits">
              {m.benefits.map((benefit, idx) => (
                <li key={idx} className="modal-benefit-item">
                  <CheckCircle2 size={18} className="icon-success" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Eligibility Criteria */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <ShieldCheck size={18} className="icon-secondary" aria-hidden="true" />
              {m.eligTitle}
            </h3>
            <ul className="modal-list-grid">
              {m.eligList.map((item, idx) => (
                <li key={idx} className="modal-card-item">
                  <span className="modal-dot" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Required Documents */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <FileText size={18} className="icon-secondary" aria-hidden="true" />
              {m.docsTitle}
            </h3>
            <div className="modal-docs-grid">
              {m.docsList.map((doc, idx) => (
                <div key={idx} className="modal-doc-card">
                  <h4 className="modal-doc-name">{doc.name}</h4>
                  <p className="modal-doc-desc">{doc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: How to Apply */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <ArrowRight size={18} className="icon-secondary" aria-hidden="true" />
              {m.stepsTitle}
            </h3>
            <ol className="modal-steps-list">
              {m.stepsList.map((step, idx) => (
                <li key={idx} className="modal-step-item">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <a
            href="https://www.pmuy.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn primary modal-action-btn"
          >
            <span>{m.openOfficial}</span>
            <ExternalLink size={18} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="btn ghost modal-close-action"
            onClick={onClose}
          >
            {m.close}
          </button>
        </div>
      </div>
    </div>
  );
}
