import { useCallback, useState } from "react";
import type { MissionFormField } from "./useMissionForm";

export type MissionFormContext = "create" | "edit";

export const useMissionDateTimePicker = () => {
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
};

export type MissionDateTimePickerState = ReturnType<typeof useMissionDateTimePicker>;
