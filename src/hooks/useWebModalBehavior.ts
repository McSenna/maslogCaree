import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

const dialogStack: symbol[] = [];

let scrollLockCount = 0;
let previousOverflow = "";

const lockPageScroll = () => {
  if (typeof document === "undefined") return;

  if (scrollLockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLockCount += 1;
};

const unlockPageScroll = () => {
  if (typeof document === "undefined") return;

  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
};

export const useWebModalBehavior = (visible: boolean, onClose: () => void) => {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (Platform.OS !== "web" || !visible) return;
    if (typeof document === "undefined") return;

    const id = Symbol("dialog");
    dialogStack.push(id);

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (dialogStack[dialogStack.length - 1] !== id) return;

      event.stopPropagation();
      closeRef.current();
    };

    document.addEventListener("keydown", handleKeyDown, true);
    lockPageScroll();

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      unlockPageScroll();

      const index = dialogStack.indexOf(id);
      if (index !== -1) dialogStack.splice(index, 1);

      previouslyFocused?.focus?.();
    };
  }, [visible]);
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const useFocusTrap = (visible: boolean) => {
  const [container, setContainer] = useState<unknown>(null);
  const attach = useCallback((node: unknown) => setContainer(node ?? null), []);

  useEffect(() => {
    if (Platform.OS !== "web" || !visible) return;
    if (typeof document === "undefined") return;

    const node = container as HTMLElement | null;
    if (!node?.querySelectorAll) return;

    const focusable = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.offsetWidth > 0 || element.offsetHeight > 0
      );

    focusable()[0]?.focus?.();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const outside = !active || !node.contains(active);

      if (event.shiftKey && (outside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (outside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [visible, container]);

  return attach;
};
