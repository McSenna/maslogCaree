/**
 * Pure state rules for a one-box-per-digit OTP field. Kept free of React and
 * React Native so the keyboard behaviour can be unit-tested with `node --test`.
 *
 * The field is modelled as one slot per digit ("" when empty) rather than a
 * joined string, so typing into a later box while an earlier one is empty puts
 * the digit where the user typed it instead of shifting it left.
 */

export type OtpSlots = string[];

export type OtpEdit = {
  slots: OtpSlots;
  focusIndex: number;
};

const DIGIT = /\d/g;

const onlyDigits = (text: string): string => (text.match(DIGIT) ?? []).join("");

const clampIndex = (index: number, length: number) => Math.max(0, Math.min(length - 1, index));

/** Converts the value held in form state (spaces mark empty slots) into slots. */
export const toOtpSlots = (value: string, length: number): OtpSlots =>
  Array.from({ length }, (_, index) => {
    const char = value[index] ?? "";
    return /\d/.test(char) ? char : "";
  });

/** Converts slots back into the form-state value; trailing empty slots are dropped. */
export const fromOtpSlots = (slots: OtpSlots): string =>
  slots
    .map((slot) => slot || " ")
    .join("")
    .trimEnd();

export const isOtpComplete = (value: string, length: number): boolean =>
  value.length === length && /^\d+$/.test(value);

/** Index of the first empty slot, or the last slot when every slot is filled. */
export const firstEmptyIndex = (slots: OtpSlots): number => {
  const index = slots.findIndex((slot) => !slot);
  return index === -1 ? slots.length - 1 : index;
};

/**
 * Applies the text a single box reported after an edit.
 *
 * - "" clears the box (cut, select-and-delete, or the platform's own backspace).
 * - Text with no digits is rejected, so letters and symbols never land in a box.
 * - One new digit fills the box and advances focus.
 * - Typing over an already-filled box reports two characters (old + new); the
 *   new one replaces the old so users can correct a digit in place.
 * - Several digits (paste, SMS/e-mail autofill) are spread from this box onward;
 *   a full-length code always fills from the first box, whichever box got it.
 */
export const applyOtpText = (slots: OtpSlots, index: number, text: string): OtpEdit => {
  const length = slots.length;
  const next = [...slots];

  if (text === "") {
    next[index] = "";
    return { slots: next, focusIndex: index };
  }

  const digits = onlyDigits(text);
  if (!digits) return { slots, focusIndex: index };

  const previous = slots[index];

  if (digits.length >= length) {
    const filled = digits.slice(0, length).split("");
    return { slots: filled, focusIndex: length - 1 };
  }

  if (digits.length === 2 && previous && digits.includes(previous)) {
    next[index] = digits[0] === previous ? digits[1] : digits[0];
    return { slots: next, focusIndex: clampIndex(index + 1, length) };
  }

  if (digits.length === 1) {
    next[index] = digits;
    return { slots: next, focusIndex: clampIndex(index + 1, length) };
  }

  digits.split("").forEach((digit, offset) => {
    if (index + offset < length) next[index + offset] = digit;
  });
  return { slots: next, focusIndex: clampIndex(index + digits.length, length) };
};

/**
 * Backspace clears the focused box; on an already-empty box it steps back and
 * clears the previous one, which is what users expect from a split code field.
 */
export const applyOtpBackspace = (slots: OtpSlots, index: number): OtpEdit => {
  if (slots[index]) {
    const next = [...slots];
    next[index] = "";
    return { slots: next, focusIndex: index };
  }
  if (index === 0) return { slots, focusIndex: 0 };

  const next = [...slots];
  next[index - 1] = "";
  return { slots: next, focusIndex: index - 1 };
};

const NAVIGATION_KEYS: Record<string, (index: number, length: number) => number> = {
  ArrowLeft: (index) => index - 1,
  ArrowRight: (index) => index + 1,
  Home: () => 0,
  End: (_index, length) => length - 1,
};

/** Focus target for a navigation key, or null when the key is not a navigation key. */
export const navigateOtp = (key: string, index: number, length: number): number | null => {
  const move = NAVIGATION_KEYS[key];
  return move ? clampIndex(move(index, length), length) : null;
};

export type OtpBoxMetrics = {
  gap: number;
  boxWidth: number;
  boxHeight: number;
  fontSize: number;
};

const MAX_BOX_WIDTH = 52;
const MIN_TOUCH_HEIGHT = 48;
const MAX_BOX_HEIGHT = 58;

/**
 * Sizes the boxes to fit the width actually available, so the row never
 * overflows: at 280px (a 320px phone inside the dialog's padding) gaps shrink to
 * 3px and six boxes still come out 44px wide; wider containers get roomier gaps
 * and boxes capped at 52px so the row stays compact on desktop.
 */
export const otpBoxMetrics = (containerWidth: number, length: number): OtpBoxMetrics => {
  const gap = containerWidth < 300 ? 3 : containerWidth < 360 ? 6 : 10;
  const fitted = Math.floor((containerWidth - gap * (length - 1)) / length);
  // No lower clamp: on an unusually narrow container the boxes shrink rather
  // than push the row past the dialog edge. Height keeps the touch target.
  const boxWidth = Math.max(1, Math.min(MAX_BOX_WIDTH, fitted));
  const boxHeight = Math.max(MIN_TOUCH_HEIGHT, Math.min(MAX_BOX_HEIGHT, Math.round(boxWidth * 1.14)));

  return { gap, boxWidth, boxHeight, fontSize: boxWidth >= 48 ? 22 : 20 };
};
