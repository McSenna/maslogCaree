import { useEffect, useState } from "react";

const HOVER_INTENT_MS = 450;

export const useHoverIntent = (hovered: boolean, delay = HOVER_INTENT_MS): boolean => {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!hovered) return;
    const timer = setTimeout(() => setSettled(true), delay);
    return () => {
      clearTimeout(timer);
      setSettled(false);
    };
  }, [hovered, delay]);

  return hovered && settled;
};
