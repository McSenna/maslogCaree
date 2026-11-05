import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

import { webKeyboardTop } from "./sheetGeometry";

const IS_WEB = Platform.OS === "web";

const readWebKeyboardTop = (): number | null => {
  const viewport = typeof window === "undefined" ? null : window.visualViewport;
  if (!viewport) return null;
  return webKeyboardTop({
    layoutHeight: window.innerHeight,
    visualHeight: viewport.height,
    visualOffsetTop: viewport.offsetTop,
    scale: viewport.scale,
  });
};

/** Where the keyboard is right now, for a sheet that opens while it is already up. */
const currentKeyboardTop = (): number | null => {
  if (IS_WEB) return readWebKeyboardTop();
  const metrics = Keyboard.metrics();
  return metrics && metrics.height > 0 ? metrics.screenY : null;
};

/**
 * Screen Y of the keyboard's top edge while it is shown, otherwise null.
 *
 * iOS reports the frame before the animation (will* events) so sheets move
 * with the keys; Android emits only did* events, re-emitting keyboardDidShow
 * when the keyboard's height changes (emoji panel, suggestion strip). Web has
 * no keyboard events, so it reads the visual viewport instead.
 */
export const useKeyboardTop = (enabled: boolean): number | null => {
  const [keyboardTop, setKeyboardTop] = useState<number | null>(() =>
    enabled ? currentKeyboardTop() : null
  );
  const [wasEnabled, setWasEnabled] = useState(enabled);

  // Re-sync when a sheet opens or closes, so a reopened sheet never starts from
  // the frame its previous session last saw.
  if (enabled !== wasEnabled) {
    setWasEnabled(enabled);
    setKeyboardTop(enabled ? currentKeyboardTop() : null);
  }

  useEffect(() => {
    if (!enabled || !IS_WEB) return;
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => setKeyboardTop(readWebKeyboardTop());
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || IS_WEB) return;

    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, ({ endCoordinates }) => {
      setKeyboardTop(endCoordinates.height > 0 ? endCoordinates.screenY : null);
    });
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardTop(null));

    return () => {
      show.remove();
      hide.remove();
    };
  }, [enabled]);

  return enabled ? keyboardTop : null;
};
