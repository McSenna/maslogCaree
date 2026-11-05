import { IMMUNIZATION_LOCATION } from "../../config/healthCenter.ts";

export const isAdministered = (record: { state: string } | null): boolean =>
  record?.state === "administered";

export const todayKey = (now: Date = new Date()): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
};

export const isCalendarDay = (day: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T00:00:00.000Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day
  );
};

export const validateBirth = (day: string, now = new Date()): string => {
  if (!isCalendarDay(day)) return "Select a valid date of birth.";
  if (day > todayKey(now)) return "The date of birth cannot be in the future.";
  return "";
};

export const validateAdministration = (
  day: string,
  birth: string,
  now = new Date(),
): string => {
  if (!isCalendarDay(day))
    return "Select the actual date this dose was administered.";
  if (day < birth.slice(0, 10))
    return "The administration date cannot be before the baby's birth date.";
  if (day > todayKey(now))
    return "The administration date cannot be in the future.";
  return "";
};

export type DoseEntryField = "administeredOn" | "administeredAt" | "administeredBy" | "reason";
export type DoseEntryErrors = Partial<Record<DoseEntryField, string>>;

type DoseEntryInput = {
  administeredOn: string;
  administeredAt?: string;
  administeredBy?: string;
  historical?: boolean;
  birth: string;
  /** Correcting or voiding a saved dose needs a reason. */
  amending: boolean;
  voiding: boolean;
  reason: string;
};

/** Each message names its field. A void replaces no clinical values, so only its reason is checked. */
export const doseEntryErrors = (entry: DoseEntryInput, now = new Date()): DoseEntryErrors => {
  const errors: DoseEntryErrors = {};
  if (entry.amending && !entry.reason.trim()) errors.reason = "Enter the reason for correcting or voiding this record.";
  if (entry.voiding) return errors;
  const date = validateAdministration(entry.administeredOn, entry.birth, now);
  if (date) errors.administeredOn = date;
  if (entry.administeredAt && !/^([01]\d|2[0-3]):[0-5]\d$/.test(entry.administeredAt)) errors.administeredAt = "Select a valid time, or clear it.";
  if (entry.historical && !entry.administeredBy?.trim()) errors.administeredBy = "Enter the clinician who administered this historical dose.";
  return errors;
};

type SavedIdentity = { state: string; historical?: boolean; administeredBy?: string; facility?: string };

/**
 * What the server will store, shown before saving. A correction keeps who gave the
 * dose and where; anything else recorded here is the signed-in midwife at the center.
 */
export const doseIdentity = (saved: SavedIdentity | null, signedInName: string) =>
  saved?.state === "administered" && !saved.historical
    ? { clinician: saved.administeredBy ?? "", location: saved.facility ?? "", keepsSaved: true }
    : { clinician: signedInName, location: IMMUNIZATION_LOCATION, keepsSaved: false };

/** Only a dose copied from an earlier record sends a clinician or location; the server ignores any other. */
export const doseRequestOf = <T extends { historical?: boolean; administeredBy?: string; facility?: string }>(administration: T) => {
  if (administration.historical) return administration;
  const { administeredBy: _clinician, facility: _location, ...request } = administration;
  return request;
};

let birthSequence = 0;
export const newBirthRequestKey = (): string =>
  `birth-${Date.now()}-${++birthSequence}-${Math.random().toString(36).slice(2)}`;

export const requestProblem = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return "The record could not be loaded or saved. Check your connection and try again.";
};
