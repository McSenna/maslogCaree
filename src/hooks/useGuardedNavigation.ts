import { useCallback, useMemo, useRef } from "react";
import { usePathname, useRouter } from "expo-router";

const REPEAT_WINDOW_MS = 600;

type Target = string | { pathname: string; params?: Record<string, unknown> };

const pathOf = (target: Target) => (typeof target === "string" ? target : target.pathname);

const hasParams = (target: Target) =>
  typeof target !== "string" && Boolean(target.params && Object.keys(target.params).length);

export const useGuardedNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const lastHref = useRef<string | null>(null);
  const lastAt = useRef(0);

  const allow = useCallback((key: string) => {
    const now = Date.now();
    if (lastHref.current === key && now - lastAt.current < REPEAT_WINDOW_MS) return false;

    lastHref.current = key;
    lastAt.current = now;
    return true;
  }, []);

  const push = useCallback(
    (target: Target) => {
      const path = pathOf(target);

      if (path === pathname && !hasParams(target)) return;
      if (!allow(path)) return;

      router.push(target as never);
    },
    [allow, pathname, router]
  );

  const replace = useCallback(
    (target: Target) => {
      if (!allow(`replace:${pathOf(target)}`)) return;
      router.replace(target as never);
    },
    [allow, router]
  );

  return useMemo(() => ({ push, replace, pathname }), [push, replace, pathname]);
};
