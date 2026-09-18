import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * Height of the on-screen keyboard, in the sheet's own coordinate space.
 *
 * `KeyboardAvoidingView` is not usable inside these sheets: they render in a
 * `statusBarTranslucent` `Modal`, and that flag puts the dialog window in
 * `FLAG_LAYOUT_NO_LIMITS` mode on Android, where `adjustResize` never reaches
 * it — the view keeps its full height and the keyboard simply covers the
 * bottom of the sheet. Measuring the keyboard ourselves and padding the sheet
 * works the same way on both platforms and inside nested modals.
 */
export const useKeyboardInset = (enabled = true): number => {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    // iOS reports the frame before the animation so the sheet moves with the
    // keyboard; Android only emits the did* pair.
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, (event) => {
      setInset(event.endCoordinates?.height ?? 0);
    });
    const hide = Keyboard.addListener(hideEvent, () => setInset(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, [enabled]);

  // Reported as 0 while disabled without storing that in state, so a closed
  // sheet never schedules a render just to clear the inset.
  return enabled ? inset : 0;
};
