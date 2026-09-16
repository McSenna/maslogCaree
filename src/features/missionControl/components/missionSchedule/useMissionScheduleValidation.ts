import { useMemo } from "react";
import type { ConsultationCategory, MissionScheduleRecord } from "@/services/appointments";
import { isEndAfterStart } from "../../utils/dateTime";
import { hasMissionOnDate, type CategoryEnabledMap } from "../../utils/missionCategories";
import type { MissionFormValues } from "../../hooks/useMissionForm";

export type MissionScheduleErrors = {
  date: string | null;
  time: string | null;
  categories: string | null;
};

type ValidationInput = {
  values: MissionFormValues;
  enabled: CategoryEnabledMap;
  categories: ConsultationCategory[];
  missions: MissionScheduleRecord[];
  excludeMissionId?: string | null;
};

export const useMissionScheduleValidation = ({
  values,
  enabled,
  categories,
  missions,
  excludeMissionId = null,
}: ValidationInput): { errors: MissionScheduleErrors; isValid: boolean } => {
  return useMemo(() => {
    const selectedCount = categories.filter((category) => enabled[category.key]).length;

    const errors: MissionScheduleErrors = {
      date: !values.date
        ? "Pick the date this mission runs."
        : hasMissionOnDate(missions, values.date, excludeMissionId)
          ? "A mission schedule already exists for this date."
          : null,
      time:
        !values.startTime || !values.endTime
          ? "Set both a start and an end time."
          : !isEndAfterStart(values.startTime, values.endTime)
            ? "End time must be later than start time."
            : null,
      categories:
        categories.length > 0 && selectedCount === 0
          ? "Turn on at least one service for this mission."
          : null,
    };

    return {
      errors,
      isValid: !errors.date && !errors.time && !errors.categories && categories.length > 0,
    };
  }, [values, enabled, categories, missions, excludeMissionId]);
};
