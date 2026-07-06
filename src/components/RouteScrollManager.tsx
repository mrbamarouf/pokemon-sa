import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const RouteScrollManager = () => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const pathChanged = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;

    if (location.hash) {
      window.requestAnimationFrame(() => {
        const targetId = window.decodeURIComponent(location.hash.slice(1));
        const target = document.getElementById(targetId);
        target?.scrollIntoView({ block: "start", behavior: "auto" });
      });
      return;
    }

    if (pathChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.hash, location.pathname]);

  return null;
};
