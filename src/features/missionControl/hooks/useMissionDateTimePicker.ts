import { useCallback, useState } from "react";
import type { MissionFormField } from "./useMissionForm";

/** Which form the picker is editing — the create panel or the edit sheet. */
export type MissionFormContext = "create" | "edit";

/**
 * The single native date/time picker both mission forms share.
 *
 * One picker instance serves six fields, so it has to remember which form and
 * which field opened it. `@react-native-community/datetimepicker` renders a
 * modal dialog on Android that is dismissed by mounting and unmounting it,
 * which is why this is open/closed state rather than a prop on each field.
 */
export function useMissionDateTimePicker() {
  const [context, setContext] = useState<MissionFormContext | null>(null);
  const [field, setField] = useState<MissionFormField | null>(null);

  const open = useCallback((nextContext: MissionFormContext, nextField: MissionFormField) => {
    setContext(nextContext);
    setField(nextField);
  }, []);

  const close = useCallback(() => {
    setContext(null);
    setField(null);
  }, []);

  return { context, field, open, close };
}

export type MissionDateTimePickerState = ReturnType<typeof useMissionDateTimePicker>;
