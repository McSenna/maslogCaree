import { useCallback, useEffect, useRef } from "react";

export const useLoginCancellation = (active = true) => {
  const pending = useRef<AbortController | null>(null);
  useEffect(() => {
    if (!active) pending.current?.abort();
    return () => { pending.current?.abort(); };
  }, [active]);
  return useCallback(() => {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    return controller;
  }, []);
};
