import { useEffect, useState } from "react";

export const PokeballCursor = () => {
  const [position, setPosition] = useState({ x: -80, y: -80 });
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    let closeTimer: number | undefined;
    let pulseTimer: number | undefined;

    const move = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      setVisible(true);
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const down = () => {
      if (!finePointer.matches) return;
      window.clearTimeout(closeTimer);
      setOpen(true);
    };

    const up = () => {
      closeTimer = window.setTimeout(() => setOpen(false), 170);
    };

    const pulse = () => {
      if (!finePointer.matches) return;
      window.clearTimeout(closeTimer);
      window.clearTimeout(pulseTimer);
      setOpen(true);
      pulseTimer = window.setTimeout(() => setOpen(false), 170);
    };

    const leave = () => setVisible(false);
    const enter = () => finePointer.matches && setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("click", pulse, true);
    window.addEventListener("blur", leave);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(pulseTimer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("click", pulse, true);
      window.removeEventListener("blur", leave);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <div
      className={`pokeball-cursor ${visible ? "is-visible" : ""} ${open ? "is-open" : ""}`}
      style={{ left: position.x, top: position.y }}
      aria-hidden="true"
    >
      <span className="pokeball-cursor-half pokeball-cursor-top" />
      <span className="pokeball-cursor-half pokeball-cursor-bottom" />
      <span className="pokeball-cursor-band" />
      <span className="pokeball-cursor-core" />
    </div>
  );
};
