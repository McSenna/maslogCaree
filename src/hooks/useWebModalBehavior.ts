import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

/**
 * Open dialogs, outermost first.
 *
 * A dialog can have a confirmation open on top of it — the profile modal over
 * the log-out prompt, user details over the deactivate prompt — and both listen
 * on `document`. Without a shared stack the outer dialog, whose listener was
 * registered first, would swallow the Escape meant for the inner one, so only
 * the entry on top of this stack acts on the key.
 */
const dialogStack: symbol[] = [];

/** Depth of the page-scroll lock, so the outer dialog does not unlock early. */
let scrollLockCount = 0;
let previousOverflow = "";

function lockPageScroll() {
  if (typeof document === "undefined") return;

  if (scrollLockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLockCount += 1;
}

function unlockPageScroll() {
  if (typeof document === "undefined") return;

  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
}

/**
 * Web-only dialog behaviours React Native's Modal does not provide: Escape to
 * dismiss, a frozen page behind the overlay, and focus returned to whatever
 * opened the dialog (§51).
 *
 * Inert on native — Android's back button already routes through the Modal's
 * `onRequestClose`, and there is no page behind to scroll.
 */
export function useWebModalBehavior(visible: boolean, onClose: () => void) {
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
      // Only the topmost dialog responds.
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
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Keeps Tab inside an open dialog, and puts the first Tab there to begin with.
 *
 * React Native's Modal renders into the same document on web, so without this
 * the page behind stays in the tab order and a keyboard user tabs straight out
 * of the dialog into a table they cannot see. Pair with `useWebModalBehavior`,
 * which owns Escape, the scroll lock and returning focus on close.
 *
 * Returns a ref callback for the dialog container — a callback rather than a
 * plain ref because Modal mounts its children after the effect would first run,
 * and re-rendering on attach is what makes the trap catch the real node.
 */
export function useFocusTrap(visible: boolean) {
  const [container, setContainer] = useState<unknown>(null);
  // Stable identity, and typed as a ref callback so it can be handed straight
  // to a View without the caller casting.
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
}
