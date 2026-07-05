import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/context/LanguageContext";

type Phase = "spin" | "open" | "gone";

export const SplashIntro = () => {
  const [phase, setPhase] = useState<Phase>("spin");
  const { t } = useLanguage();

  useEffect(() => {
    const openTimer = window.setTimeout(() => setPhase("open"), 1500);
    const doneTimer = window.setTimeout(() => setPhase("gone"), 3300);
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "gone") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div className={`pokemon-intro ${phase === "open" ? "is-open" : ""}`} aria-label={`Opening ${t("brand")}`}>
      <div className="intro-electric-ring" />
      <div className="pokeball-shell" aria-hidden="true">
        <span className="pokeball-half pokeball-top" />
        <span className="pokeball-half pokeball-bottom" />
        <span className="pokeball-band" />
        <span className="pokeball-button" />
      </div>
      <img src={logo} alt={t("brand")} className="intro-brand-logo" />
      <div className="intro-title">
        <span>{t("brand")}</span>
      </div>
    </div>
  );
};
