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

/** The date and time range a mission runs on. */
export type MissionFormValues = {
  /** `YYYY-MM-DD`, as the API stores it. */
  date: string;
  startTime: string;
  endTime: string;
};

/** Which of the three date/time fields a picker is editing. */
export type MissionFormField = "date" | "start" | "end";

const FIELD_KEYS: Record<MissionFormField, keyof MissionFormValues> = {
  date: "date",
  start: "startTime",
  end: "endTime",
};

/**
 * One mission scheduling form — the date and hours, plus which services run
 * and for how long.
 *
 * Create and Edit are the same form over different starting values, so they
 * share this rather than keeping two parallel sets of state in the screen.
 * They differ only in how they seed it: Create merges the catalogue's defaults
 * and keeps anything already typed, while Edit replaces everything with the
 * saved mission.
 */
export function useMissionForm(initialDate: string) {
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

  /**
   * Fills in services the form has not seen yet, leaving edits alone.
   *
   * The catalogue is re-read after every write, and overwriting here would
   * discard a selection the health worker made while the request was in
   * flight.
   */
  const mergeDefaults = useCallback(
    (defaults: { enabled: CategoryEnabledMap; durations: CategoryDurationMap }) => {
      setEnabled((previous) => ({ ...defaults.enabled, ...previous }));
      setDurations((previous) => ({ ...defaults.durations, ...previous }));
    },
    []
  );

  /** Replaces the whole form — how Edit loads an existing mission. */
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
}

export type MissionForm = ReturnType<typeof useMissionForm>;
