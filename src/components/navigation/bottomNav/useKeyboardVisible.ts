import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * Tracks soft-keyboard visibility.
 *
 * A bar docked to the bottom edge would otherwise sit on top of the keyboard
 * (Android, where the window resizes) or behind it (iOS), covering the submit
 * and cancel controls of forms such as "Book an Appointment".
 */
export function useKeyboardVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // iOS gets the "will" events so the bar leaves in step with the keyboard;
    // Android only emits the "did" pair.
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => setVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return visible;
}
