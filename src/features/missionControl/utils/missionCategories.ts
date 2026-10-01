import type { ConsultationCategory, MissionScheduleRecord } from "@/services/appointments";
import { isServiceDay } from "@/utils/serviceDays";
import { FALLBACK_DURATION_MINUTES } from "../constants/missionSchedule";
import { isoTimestampToDateKey } from "./dateTime";

export type CategoryEnabledMap = Record<string, boolean>;

export type CategoryDurationMap = Record<string, number>;

export type MissionCategoryPayload = {
  categoryKey: string;
  durationMinutes: number;
};

export const isVariableDuration = (category: ConsultationCategory): boolean => {
  return category.durationMinutesMin != null && category.durationMinutesMax != null;
};

export const defaultDurationFor = (category: ConsultationCategory): number => {
  if (typeof category.durationMinutes === "number") return category.durationMinutes;
  return category.durationMinutesMin ?? FALLBACK_DURATION_MINUTES;
};

export const resolveDuration = (
  category: ConsultationCategory,
  durations: CategoryDurationMap
): number => {
  return durations[category.key] ?? defaultDurationFor(category);
};

export const clampDuration = (category: ConsultationCategory, minutes: number): number => {
  const min = category.durationMinutesMin ?? minutes;
  const max = category.durationMinutesMax ?? minutes;
  return Math.min(max, Math.max(min, minutes));
};

/** False for a fixed-day service (immunization) on any other day; true until a date is picked. */
export const isCategoryOnDate = (category: ConsultationCategory, dateKey: string): boolean =>
  !dateKey || isServiceDay(category.key, dateKey);

/**
 * A switched-on service only joins the mission when it runs on the chosen
 * date. The toggle state itself is kept, so picking a valid day restores it.
 */
export const isCategoryOffered = (
  category: ConsultationCategory,
  enabled: CategoryEnabledMap,
  dateKey: string
): boolean => Boolean(enabled[category.key]) && isCategoryOnDate(category, dateKey);

export const buildCategoriesPayload = (
  categories: ConsultationCategory[],
  enabled: CategoryEnabledMap,
  durations: CategoryDurationMap,
  dateKey: string
): MissionCategoryPayload[] => {
  return categories
    .filter((category) => isCategoryOffered(category, enabled, dateKey))
    .map((category) => ({
      categoryKey: category.key,
      durationMinutes: resolveDuration(category, durations),
    }));
};

export const catalogueDefaults = (categories: ConsultationCategory[]): {
  enabled: CategoryEnabledMap;
  durations: CategoryDurationMap;
} => {
  const enabled: CategoryEnabledMap = {};
  const durations: CategoryDurationMap = {};

  for (const category of categories) {
    enabled[category.key] = true;
    durations[category.key] = defaultDurationFor(category);
  }

  return { enabled, durations };
};

export const missionCategorySelection = (
  mission: MissionScheduleRecord,
  categories: ConsultationCategory[]
): { enabled: CategoryEnabledMap; durations: CategoryDurationMap } => {
  const saved = new Map(
    (mission.categories ?? []).map((entry) => [entry.categoryKey, entry.durationMinutes])
  );
  const enabled: CategoryEnabledMap = {};
  const durations: CategoryDurationMap = {};

  for (const category of categories) {
    const savedDuration = saved.get(category.key);
    enabled[category.key] = savedDuration != null;
    durations[category.key] = savedDuration ?? defaultDurationFor(category);
  }

  return { enabled, durations };
};

export const hasMissionOnDate = (
  missions: MissionScheduleRecord[],
  dateKey: string,
  excludeMissionId?: string | null
): boolean => {
  return missions.some(
    (mission) =>
      mission._id !== excludeMissionId && isoTimestampToDateKey(mission.date) === dateKey
  );
};
