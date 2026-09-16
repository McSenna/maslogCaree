import { useCallback, useState } from "react";
import type { ConsultationCategory } from "@/services/appointments";
import { DEFAULT_MISSION_TIME } from "../constants/missionSchedule";
import {
  buildCategoriesPayload,
  clampDuration,
  type CategoryDurationMap,
  type CategoryEnabledMap,
  type MissionCategoryPayload,
} from "../utils/missionCategories";

export type MissionFormValues = {
  date: string;
  startTime: string;
  endTime: string;
};

export type MissionFormField = "date" | "start" | "end";

const FIELD_KEYS: Record<MissionFormField, keyof MissionFormValues> = {
  date: "date",
  start: "startTime",
  end: "endTime",
};

export const useMissionForm = (initialDate: string) => {
  const [values, setValues] = useState<MissionFormValues>({
    date: initialDate,
    startTime: DEFAULT_MISSION_TIME.start,
    endTime: DEFAULT_MISSION_TIME.end,
  });
  const [enabled, setEnabled] = useState<CategoryEnabledMap>({});
  const [durations, setDurations] = useState<CategoryDurationMap>({});

  const setField = useCallback((field: MissionFormField, next: string) => {
    setValues((previous) => ({ ...previous, [FIELD_KEYS[field]]: next }));
  }, []);

  const toggleCategory = useCallback((categoryKey: string) => {
    setEnabled((previous) => ({ ...previous, [categoryKey]: !previous[categoryKey] }));
  }, []);

  const setDuration = useCallback((category: ConsultationCategory, minutes: number) => {
    setDurations((previous) => ({ ...previous, [category.key]: clampDuration(category, minutes) }));
  }, []);

  const mergeDefaults = useCallback(
    (defaults: { enabled: CategoryEnabledMap; durations: CategoryDurationMap }) => {
      setEnabled((previous) => ({ ...defaults.enabled, ...previous }));
      setDurations((previous) => ({ ...defaults.durations, ...previous }));
    },
    []
  );

  const reset = useCallback(
    (next: {
      values: MissionFormValues;
      enabled: CategoryEnabledMap;
      durations: CategoryDurationMap;
    }) => {
      setValues(next.values);
      setEnabled(next.enabled);
      setDurations(next.durations);
    },
    []
  );

  const toPayload = useCallback(
    (categories: ConsultationCategory[]): MissionCategoryPayload[] =>
      buildCategoriesPayload(categories, enabled, durations),
    [enabled, durations]
  );

  return {
    values,
    enabled,
    durations,
    setField,
    toggleCategory,
    setDuration,
    mergeDefaults,
    reset,
    toPayload,
  };
};

export type MissionForm = ReturnType<typeof useMissionForm>;
