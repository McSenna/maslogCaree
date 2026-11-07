/**
 * Queue wording for staff, with no app imports so `node --test` can load it.
 * The groups mirror the backend's utils/priorityQueue.js; the server also sends
 * `priorityGroupLabel`, which wins whenever it is present.
 */
import type { QueueWaitReason } from "../../../types/appointments.types.ts";

export const UNKNOWN_PRIORITY_GROUP = 7;

const PRIORITY_GROUP_LABELS: Readonly<Record<number, string>> = {
  1: "Infants under 1 year",
  2: "Adults 60 and older",
  3: "Children 1 to 5",
  4: "Children 6 to 12",
  5: "Adolescents 13 to 17",
  6: "Adults 18 to 59",
  [UNKNOWN_PRIORITY_GROUP]: "Birth date needed",
};

type Ranked = { priorityGroupLabel?: string; prioritySortKey?: number; ageTier?: number };

/** "Group 2: Adults 60 and older", or the flag that the birth date must be fixed. */
export const priorityGroupText = (row: Ranked): string => {
  const group = row.prioritySortKey ?? row.ageTier;
  const label = row.priorityGroupLabel ?? (group != null ? PRIORITY_GROUP_LABELS[group] : undefined);
  if (!label) return "Not ranked yet";
  if (group === UNKNOWN_PRIORITY_GROUP || label === PRIORITY_GROUP_LABELS[UNKNOWN_PRIORITY_GROUP]) return label;
  return group != null ? `Group ${group}: ${label}` : label;
};

export const needsBirthDate = (row: Ranked): boolean =>
  (row.prioritySortKey ?? row.ageTier) === UNKNOWN_PRIORITY_GROUP;

/** Why a queued doctor request has no time yet; null for services the queue does not place. */
export const waitReasonText = (reason: QueueWaitReason | null | undefined, serviceLabel: string): string | null => {
  if (reason === "no_mission") return `Waiting for a doctor mission that offers ${serviceLabel}`;
  if (reason === "no_open_time") return "Upcoming missions have no open time that fits this visit";
  return null;
};
