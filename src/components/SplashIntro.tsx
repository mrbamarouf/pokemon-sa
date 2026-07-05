import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/context/LanguageContext";

type Phase = "spin" | "open" | "gone";

const INTRO_SKIP_KEY = "pokemon-sa-skip-intro-on-next-load";
let introPlayedForDocument = false;

const readIntroSkip = () => {
  try {
    const shouldSkip = window.sessionStorage.getItem(INTRO_SKIP_KEY) === "true";
    if (shouldSkip) {
      window.sessionStorage.removeItem(INTRO_SKIP_KEY);
    }
    return shouldSkip;
  } catch {
    return false;
  }
};

const shouldPlayIntro = () => {
  if (introPlayedForDocument) return false;
  if (readIntroSkip()) {
    introPlayedForDocument = true;
    return false;
  }
  return true;
};

export const skipSplashIntroOnNextLoad = () => {
  try {
    window.sessionStorage.setItem(INTRO_SKIP_KEY, "true");
    window.setTimeout(() => {
      window.sessionStorage.removeItem(INTRO_SKIP_KEY);
    }, 500);
  } catch {
    // Ignore storage failures; the app-level mount guard still prevents SPA replays.
  }
};

export const SplashIntro = () => {
  const [shouldPlay] = useState(shouldPlayIntro);
  const [phase, setPhase] = useState<Phase>("spin");
  const { t } = useLanguage();

  useEffect(() => {
    if (!shouldPlay) return;

    introPlayedForDocument = true;
    const openTimer = window.setTimeout(() => setPhase("open"), 1500);
    const doneTimer = window.setTimeout(() => setPhase("gone"), 3300);
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, [shouldPlay]);

  useEffect(() => {
    if (phase === "gone") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  if (!shouldPlay) return null;
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
