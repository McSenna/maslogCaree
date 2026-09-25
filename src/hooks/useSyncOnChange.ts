import { useState } from "react";

const depsChanged = (prev: readonly unknown[], next: readonly unknown[]) =>
  prev.length !== next.length || next.some((value, index) => !Object.is(value, prev[index]));

/**
 * Runs `sync` during render on mount and whenever `deps` change (React's "adjust state when a prop
 * changes" pattern). Prefer it over a useEffect that only resets or re-seeds local state: the new
 * state is in place before paint, so a reopened form never flashes its previous values.
 *
 * `sync` must only call state setters owned by the calling component — no side effects.
 */
export const useSyncOnChange = (deps: readonly unknown[], sync: () => void) => {
  const [prevDeps, setPrevDeps] = useState<readonly unknown[] | null>(null);

  if (prevDeps === null || depsChanged(prevDeps, deps)) {
    setPrevDeps(deps);
    sync();
  }
};
