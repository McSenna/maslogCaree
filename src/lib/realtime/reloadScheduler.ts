// When a server-computed view reloads after realtime changes. Free of React so
// it runs under `node --test`.

type Reload = () => Promise<unknown> | void;

export type ReloadScheduler = {
  /** Something the view shows changed. The ask is never dropped, only folded into another reload. */
  request: () => void;
  /** Stops planned reloads (unmount, live updates off). A reload already running finishes on its own. */
  cancel: () => void;
};

type Options = {
  /** The least time between the starts of two reloads. */
  intervalMs: number;
  now?: () => number;
};

/**
 * Reloads on the first change at once, then at most once per `intervalMs`
 * while changes keep coming, never two at a time, and always once more after
 * the last change, because a reload already running may have read the data
 * before it. A trailing debounce waits for a quiet gap instead, so a view
 * watching a busy feed stopped updating until the feed went quiet.
 */
export const createReloadScheduler = (
  reload: Reload,
  { intervalMs, now = () => performance.now() }: Options
): ReloadScheduler => {
  let running = false;
  let rerun = false;
  let cancelled = false;
  let lastStart = Number.NEGATIVE_INFINITY;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const finish = () => {
    running = false;
    if (!rerun || cancelled) return;
    rerun = false;
    request();
  };

  const start = () => {
    timer = null;
    running = true;
    lastStart = now();
    let result: Promise<unknown> | void;
    try {
      result = reload();
    } catch {
      result = undefined;
    }
    // The view reports its own failures; a failed reload must not stop the next one.
    Promise.resolve(result).then(finish, finish);
  };

  const request = () => {
    if (cancelled) return;
    if (running) {
      rerun = true;
      return;
    }
    // A planned reload starts after this change, so it already covers it.
    if (timer) return;
    const wait = lastStart + intervalMs - now();
    if (wait > 0) timer = setTimeout(start, wait);
    else start();
  };

  const cancel = () => {
    cancelled = true;
    rerun = false;
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return { request, cancel };
};
