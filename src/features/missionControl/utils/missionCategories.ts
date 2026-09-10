import type { ConsultationCategory, MissionScheduleRecord } from "@/services/appointments";
import { FALLBACK_DURATION_MINUTES } from "../constants/missionSchedule";
import { isoTimestampToDateKey } from "./dateTime";

/** Which services this mission runs, keyed by category key. */
export type CategoryEnabledMap = Record<string, boolean>;

/** The slot length chosen for each service, keyed by category key. */
export type CategoryDurationMap = Record<string, number>;

/** One service's entry in a create or update request body. */
export type MissionCategoryPayload = {
  categoryKey: string;
  durationMinutes: number;
};

/**
 * Whether the health worker picks this service's slot length.
 *
 * A category with a min and a max is a range the mission decides within; one
 * with a fixed `durationMinutes` is set by the catalogue and not editable.
 */
export function isVariableDuration(category: ConsultationCategory): boolean {
  return category.durationMinutesMin != null && category.durationMinutesMax != null;
}

/**
 * The slot length to show before the health worker touches anything.
 *
 * Prefers the catalogue's fixed duration, falls back to the bottom of an
 * allowed range, and only then to a house default.
 */
export function defaultDurationFor(category: ConsultationCategory): number {
  if (typeof category.durationMinutes === "number") return category.durationMinutes;
  return category.durationMinutesMin ?? FALLBACK_DURATION_MINUTES;
}

/** The duration in the form, or the catalogue default when untouched. */
export function resolveDuration(
  category: ConsultationCategory,
  durations: CategoryDurationMap
): number {
  return durations[category.key] ?? defaultDurationFor(category);
}

/**
 * A typed duration held inside the catalogue's allowed range.
 *
 * Clamped rather than rejected so the field stays usable while being typed;
 * the server enforces the same bounds on write.
 */
export function clampDuration(category: ConsultationCategory, minutes: number): number {
  const min = category.durationMinutesMin ?? minutes;
  const max = category.durationMinutesMax ?? minutes;
  return Math.min(max, Math.max(min, minutes));
}

/** Every service turned on, with its chosen slot length — the request body. */
export function buildCategoriesPayload(
  categories: ConsultationCategory[],
  enabled: CategoryEnabledMap,
  durations: CategoryDurationMap
): MissionCategoryPayload[] {
  return categories
    .filter((category) => enabled[category.key])
    .map((category) => ({
      categoryKey: category.key,
      durationMinutes: resolveDuration(category, durations),
    }));
}

/** The catalogue's own defaults: everything on, at its standard slot length. */
export function catalogueDefaults(categories: ConsultationCategory[]): {
  enabled: CategoryEnabledMap;
  durations: CategoryDurationMap;
} {
  const enabled: CategoryEnabledMap = {};
  const durations: CategoryDurationMap = {};

  for (const category of categories) {
    enabled[category.key] = true;
    durations[category.key] = defaultDurationFor(category);
  }

  return { enabled, durations };
}

/**
 * An existing mission projected back onto the full catalogue.
 *
 * Every service is listed so one can be switched on, but only those the
 * mission actually carries start enabled — and each keeps the duration that
 * was saved, not the catalogue's default.
 */
export function missionCategorySelection(
  mission: MissionScheduleRecord,
  categories: ConsultationCategory[]
): { enabled: CategoryEnabledMap; durations: CategoryDurationMap } {
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
}

/**
 * Whether another schedule already claims this day.
 *
 * A presentation guard only — the server rejects a duplicate regardless. It
 * exists so the health worker is told before losing the form they filled in.
 */
export function hasMissionOnDate(
  missions: MissionScheduleRecord[],
  dateKey: string,
  excludeMissionId?: string | null
): boolean {
  return missions.some(
    (mission) =>
      mission._id !== excludeMissionId && isoTimestampToDateKey(mission.date) === dateKey
  );
}
