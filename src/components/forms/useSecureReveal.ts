import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Platform, type NativeSyntheticEvent, type TextInput, type TextInputSelectionChangeEventData } from "react-native";

type Selection = { start: number; end: number };

/**
 * Show/hide state for a password input. Android moves the caret to the start
 * when `secureTextEntry` flips, so the last selection is put back after each
 * toggle. Web keeps the same input element and its caret on its own.
 */
export const useSecureReveal = (inputRef: RefObject<TextInput | null>) => {
  const [revealed, setRevealed] = useState(false);
  const selection = useRef<Selection | null>(null);

  const trackSelection = useCallback((event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    selection.current = event.nativeEvent.selection;
  }, []);

  // Runs after the new secureTextEntry has been applied to the native view.
  useEffect(() => {
    if (Platform.OS === "web" || !selection.current) return;
    inputRef.current?.setSelection(selection.current.start, selection.current.end);
  }, [revealed, inputRef]);

  const toggle = useCallback(() => setRevealed((value) => !value), []);

  return { revealed, toggle, trackSelection };
};
