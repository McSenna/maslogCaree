import { useCallback } from "react";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";

type LinkPressEvent = {
  preventDefault: () => void;
  button?: number | null;
  metaKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  currentTarget?: unknown;
};

const anchorTarget = (event: LinkPressEvent): string | null | undefined =>
  (event.currentTarget as { target?: string | null } | null | undefined)?.target;

const opensOutsideThisTab = (event: LinkPressEvent) =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) ||
  (event.button != null && event.button !== 0) ||
  Boolean(anchorTarget(event) && !["", "self"].includes(anchorTarget(event) as string));

export const useNavLinkPress = (href: string, replace = false) => {
  const router = useGuardedNavigation();

  return useCallback(
    (event: LinkPressEvent) => {
      if (opensOutsideThisTab(event)) return;

      event.preventDefault();

      if (replace) router.replace(href);
      else router.push(href);
    },
    [href, replace, router]
  );
};
