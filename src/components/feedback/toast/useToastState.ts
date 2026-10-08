import { useEffect, useState } from "react";
import {
  dismissToast,
  registerToastLayer,
  subscribeToToastOffset,
  subscribeToToastPlacement,
  subscribeToToasts,
  subscribeToTopToastLayer,
  type ToastMessage,
  type ToastPlacement,
} from "./toastStore";

export type ToastLayerKind = "root" | "overlay";

/**
 * The toast this viewport should draw: only the topmost layer draws, and only it
 * runs the dismiss timer, which waits while the pointer or focus is on the toast.
 * An inactive viewport (a modal on its way out) gives up its layer at once, so a
 * toast raised as a save closes its modal draws once, at the root, instead of
 * inside the closing modal and then again when the modal unmounts.
 */
export const useToastState = (layer: ToastLayerKind, active = true) => {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [isTop, setIsTop] = useState(false);
  const [paused, setPaused] = useState(false);
  const [placement, setPlacement] = useState<ToastPlacement>("bottom");

  useEffect(() => subscribeToToasts(setMessage), []);
  useEffect(() => subscribeToToastPlacement(setPlacement), []);

  // The bottom navigation only sits under the app root, never under a modal.
  useEffect(() => (layer === "root" ? subscribeToToastOffset(setBottomOffset) : undefined), [layer]);

  useEffect(() => {
    if (!active) return;
    const handle = registerToastLayer();
    const unsubscribe = subscribeToTopToastLayer((top) => setIsTop(top === handle.id));
    return () => {
      unsubscribe();
      handle.unregister();
    };
  }, [active]);

  const draws = active && isTop;

  useEffect(() => {
    if (!message || !draws || paused) return;
    const timer = setTimeout(() => dismissToast(message.id), message.durationMs);
    return () => clearTimeout(timer);
  }, [message, draws, paused]);

  return { message: draws ? message : null, bottomOffset, placement, setPaused };
};
