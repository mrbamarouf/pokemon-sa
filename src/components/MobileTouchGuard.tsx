import { useEffect } from "react";

const railSelector = [
  ".mobile-product-rail",
  ".mobile-game-tabs",
  ".special-request-proof-grid",
  ".product-thumbnail-grid",
  ".reward-choice-grid",
  ".apparel-character-grid",
  ".mobile-shop-dock-track",
  ".mobile-native-feature-stack",
  ".mobile-native-drop-board",
  ".mobile-native-character-strip",
  ".mobile-native-apparel-products",
  ".mobile-native-tabbar",
  ".mobile-apparel-card .mobile-card-options .flex",
].join(",");

export const MobileTouchGuard = () => {
  useEffect(() => {
    if (!("ontouchstart" in window) && navigator.maxTouchPoints < 1) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!event.cancelable) return;
      const touch = event.touches[0];
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const horizontal = Math.abs(dx);
      const vertical = Math.abs(dy);

      if (horizontal < 10 || horizontal <= vertical * 1.08) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(railSelector)) return;

      event.preventDefault();
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return null;
};
