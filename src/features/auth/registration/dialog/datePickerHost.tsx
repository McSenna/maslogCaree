import { createContext, useContext } from "react";

export type DatePickerRequest = {
  value: string;
  onConfirm: (isoDate: string) => void;
};

type DatePickerHost = {
  open: (request: DatePickerRequest) => void;
};

/**
 * Lets a date field deep inside the registration form ask the dialog to open
 * the picker, instead of rendering the picker itself.
 *
 * The registration dialog is a `Modal`, and on Android opening a second modal
 * from inside it — or the keyboard dismissing as the field is tapped — can make
 * the host dialog recreate its view hierarchy. That remounts the form subtree
 * and wipes any state held there, so a picker owning its own `open` flag next
 * to the input flashes and closes again. Keeping the flag in the dialog
 * component, outside the `Modal` element, makes it survive that remount. It is
 * the same reason the OTP modal is rendered at the dialog's top level.
 */
const DatePickerHostContext = createContext<DatePickerHost | null>(null);

export const DatePickerHostProvider = DatePickerHostContext.Provider;

export const useDatePickerHost = (): DatePickerHost | null =>
  useContext(DatePickerHostContext);
