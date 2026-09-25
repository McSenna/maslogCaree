import { Keyboard } from "react-native";

import type { SheetLayout } from "./useSheetLayout";

/**
 * Android Back handler for a sheet: the first press only hides the keyboard,
 * the next one closes. On recent Android versions a modal receives Back even
 * while the keyboard is up, so without this a user dismissing the keyboard
 * was asked to discard the whole form (or lost it outright).
 */
export const backDismissesKeyboardFirst =
  (layout: Pick<SheetLayout, "keyboardVisible">, close: () => void) => () => {
    if (layout.keyboardVisible) {
      Keyboard.dismiss();
      return;
    }
    close();
  };
