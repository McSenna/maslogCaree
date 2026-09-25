import { useEffect, useReducer, useRef, useState } from "react";
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from "react-native";
import {
  applyOtpBackspace,
  applyOtpText,
  firstEmptyIndex,
  fromOtpSlots,
  isOtpComplete,
  navigateOtp,
  otpBoxMetrics,
  toOtpSlots,
} from "../otpEntry";

const DEFAULT_WIDTH = 320;

type Options = {
  value: string;
  onChange: (next: string) => void;
  onSubmit?: (code: string) => void;
  length: number;
  focusRequest?: number;
};

export const useOtpInput = ({ value, onChange, onSubmit, length, focusRequest }: Options) => {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(DEFAULT_WIDTH);
  // A rejected keystroke (a letter, or retyping the same digit) leaves `value`
  // unchanged, and without a render a native TextInput keeps showing what was typed.
  const [, rerender] = useReducer((count: number) => count + 1, 0);

  const slots = toOtpSlots(value, length);
  const metrics = otpBoxMetrics(containerWidth, length);

  const focusBox = (index: number) => inputs.current[index]?.focus();

  useEffect(() => {
    if (focusRequest === undefined || focusRequest === 0) return;
    // Wait a frame so a box that was disabled while a request ran is editable again.
    const frame = requestAnimationFrame(() => focusBox(firstEmptyIndex(toOtpSlots(value, length))));
    return () => cancelAnimationFrame(frame);
    // Only a new request should move focus, not every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest]);

  const commit = (nextSlots: string[], focusIndex: number) => {
    const next = fromOtpSlots(nextSlots);
    if (next !== value) onChange(next);
    else rerender();
    if (focusIndex !== focusedIndex) focusBox(focusIndex);
  };

  const handleChangeText = (text: string, index: number) => {
    const edit = applyOtpText(slots, index, text);
    commit(edit.slots, edit.focusIndex);
  };

  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    const { key } = event.nativeEvent;

    if (key === "Backspace") {
      // A filled box is cleared by the platform's own edit (onChangeText("")),
      // so only the empty-box case (step back) needs handling here.
      if (slots[index]) return;
      const edit = applyOtpBackspace(slots, index);
      commit(edit.slots, edit.focusIndex);
      return;
    }

    const target = navigateOtp(key, index, length);
    if (target !== null) {
      (event as unknown as { preventDefault?: () => void }).preventDefault?.();
      focusBox(target);
    }
  };

  const handleSubmitEditing = () => {
    if (isOtpComplete(value, length)) onSubmit?.(value);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const width = Math.floor(event.nativeEvent.layout.width);
    if (width > 0 && width !== containerWidth) setContainerWidth(width);
  };

  const registerInput = (index: number) => (element: TextInput | null) => {
    inputs.current[index] = element;
  };

  return {
    slots,
    metrics,
    focusedIndex,
    hoveredIndex,
    setFocusedIndex,
    setHoveredIndex,
    focusBox,
    registerInput,
    handleChangeText,
    handleKeyPress,
    handleSubmitEditing,
    onLayout,
  };
};

export type OtpInputController = ReturnType<typeof useOtpInput>;
