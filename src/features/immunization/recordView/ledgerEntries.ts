// Import-free at runtime except sibling pure modules, so `node --test` can load it.
import { formatClock } from "../../../components/medicalRecord/fields/clockFormat.ts";
import { formatCalendarDay } from "../../medicalRecordMasterlist/masterlistLabels.ts";
import { historyDose, savedDoseStatus } from "../savedDosePresentation.ts";
import type { Checklist, DoseRecord, DoseView } from "../types";
import type { VaccinationEntry, VaccinationField, VaccinationGroup, VaccinationStatus } from "./vaccinationTypes";

const NOT_RECORDED = "Not recorded";
const NOT_ADMINISTERED = "Not administered";

const STATUS_BY_LABEL: Record<string, VaccinationStatus> = {
  Administered: "administered",
  Deferred: "deferred",
  "Requires review": "review",
  Voided: "voided",
  "Draft. Not administered": "draft",
};

const NOTES: Partial<Record<VaccinationStatus, string>> = {
  deferred: "This dose was deferred. It has not been given.",
  review: "A midwife needs to review this dose. It is not recorded as given.",
  voided: "This entry was voided. It does not count as a dose given.",
  draft: "This draft is not a finalized record. Continue it from Edit record.",
};

const text = (value: string | undefined): string => value?.trim() || NOT_RECORDED;

const nextDoseOf = (checklist: Checklist, dose: DoseView, administered: boolean): string => {
  const series = checklist.doses.filter((item) => item.vaccineKey === dose.vaccineKey);
  const position = series.findIndex((item) => item.key === dose.key);
  if (position < 0) return NOT_RECORDED;
  const next = series.slice(administered ? position + 1 : position).find((item) => item.status !== "Administered");
  return next ? `${next.label}, ${formatCalendarDay(next.scheduledOn)}` : "None scheduled";
};

const ageLabelOf = (checklist: Checklist, dose: DoseView): string =>
  checklist.schedule.slots.find((slot) => slot.key === dose.slot)?.label ?? NOT_RECORDED;

const optionalField = (label: string, value: string | undefined): VaccinationField[] =>
  value?.trim() ? [{ label, value: value.trim() }] : [];

const administeredFields = (checklist: Checklist, dose: DoseView, record: DoseRecord): VaccinationField[] => [
  { label: "Time", value: text(formatClock(record.administeredAt)) },
  { label: "Clinician", value: text(record.administeredBy) },
  { label: "Location", value: text(record.facility) },
  // No longer entered by hand, so each appears only when the dose has one.
  ...optionalField("Batch or lot number", record.lotNumber),
  ...optionalField("Route", record.route),
  ...optionalField("Site", record.site),
  { label: "Schedule age", value: ageLabelOf(checklist, dose) },
  { label: "Routine target", value: formatCalendarDay(dose.targetOn) },
  { label: "Next scheduled dose", value: nextDoseOf(checklist, dose, true) },
  { label: "Historical record", value: record.historical ? "Yes" : "No" },
  { label: "Remarks", value: text(record.remarks), long: true },
  // A blank here means nobody recorded one. It is never evidence that no reaction occurred.
  { label: "Immediate reaction", value: text(record.immediateReaction), long: true },
  { label: "Adverse event (AEFI)", value: text(record.aefi), long: true },
  // Residents never receive this: their response leaves `reason` off an administered dose.
  ...(record.reason?.trim() ? [{ label: "Correction reason", value: record.reason.trim(), long: true }] : []),
];

// A voided dose keeps its old clinical values, and a draft's are unconfirmed.
// Neither may be displayed as something that was given.
const outstandingFields = (checklist: Checklist, dose: DoseView, record: DoseRecord): VaccinationField[] => [
  { label: "Schedule age", value: ageLabelOf(checklist, dose) },
  { label: "Routine target", value: formatCalendarDay(dose.targetOn) },
  { label: "Follow-up date", value: formatCalendarDay(record.followUpOn) },
  { label: "Reason", value: text(record.reason), long: true },
];

const toEntry = (checklist: Checklist, record: DoseRecord): VaccinationEntry => {
  const dose = historyDose(checklist, record);
  const statusLabel = savedDoseStatus(record);
  const status = STATUS_BY_LABEL[statusLabel] ?? "review";
  const administered = status === "administered";
  const vaccine = checklist.schedule.vaccines.find((item) => item.key === dose.vaccineKey);
  return {
    id: record.doseKey,
    vaccineName: vaccine?.name ?? dose.vaccineKey,
    doseLabel: dose.label,
    status,
    statusLabel,
    administered,
    dateLabel: administered ? formatCalendarDay(record.administeredOn) : NOT_ADMINISTERED,
    nextDose: nextDoseOf(checklist, dose, administered),
    fields: administered ? administeredFields(checklist, dose, record) : outstandingFields(checklist, dose, record),
    note: NOTES[status],
  };
};

/** Doses given come first, oldest first like a vaccination card; the rest follow in schedule order. */
export const entriesFromChecklist = (checklist: Checklist): VaccinationEntry[] => {
  const scheduleOrder = new Map(checklist.doses.map((dose, index) => [dose.key, index]));
  const orderOf = (record: DoseRecord) => scheduleOrder.get(record.doseKey) ?? scheduleOrder.size;
  const isGiven = (record: DoseRecord) => STATUS_BY_LABEL[savedDoseStatus(record)] === "administered";
  return [...checklist.history]
    .sort((a, b) => {
      if (isGiven(a) !== isGiven(b)) return isGiven(a) ? -1 : 1;
      const byDate = isGiven(a) ? (a.administeredOn ?? "").localeCompare(b.administeredOn ?? "") : 0;
      return byDate || orderOf(a) - orderOf(b);
    })
    .map((record) => toEntry(checklist, record));
};

/** With a visit, its doses come first and the rest of the baby's record is labeled as separate. */
export const detailGroupsOf = (entries: VaccinationEntry[], visitDoseKeys: readonly string[] | null): VaccinationGroup[] => {
  const atVisit = visitDoseKeys ? entries.filter((entry) => visitDoseKeys.includes(entry.id)) : [];
  const rest = entries.filter((entry) => !atVisit.includes(entry));
  const groups: VaccinationGroup[] = [
    { title: "Documented at this visit", entries: atVisit },
    { title: visitDoseKeys ? "Other doses administered" : "Doses administered", entries: rest.filter((entry) => entry.administered) },
    { title: "Not administered", entries: rest.filter((entry) => !entry.administered) },
  ];
  return groups.filter((group) => group.entries.length > 0);
};

/** Scheduled doses with no record are never counted as given. */
export const doseCountsOf = (checklist: Checklist) => ({
  administered: checklist.doses.filter((dose) => dose.record?.state === "administered" && dose.record.workflowStatus !== "draft").length,
  total: checklist.doses.length,
});

export const nextDoseNote = (checklist: Checklist): string =>
  checklist.schedule.activationStatus === "active"
    ? "Schedule dates are routine targets unless a visit is assigned. A target date does not confirm clinical eligibility."
    : "The health center has not verified this schedule yet, so doses with no record and their dates are unconfirmed.";
