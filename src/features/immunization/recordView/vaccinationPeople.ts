// Import-free at runtime except sibling pure modules, so `node --test` can load it.
import { immunizationProgressLabel } from "../../../services/immunizationRecordProgress.ts";
import type { MedicalRecord } from "../../../services/medicalRecordTypes";
import { formatCalendarDay, LINKAGE_PILLS } from "../../medicalRecordMasterlist/masterlistLabels.ts";
import type { MasterlistDetail } from "../../medicalRecordMasterlist/types";
import type { Checklist } from "../types";
import { babyIdOf } from "./vaccinationScope.ts";
import type { PersonSummary } from "./vaccinationTypes";

const NOT_RECORDED = "Not recorded";
const NOT_LINKED = "No baby is linked to this record.";

const capitalize = (value: string) => (value ? value[0].toUpperCase() + value.slice(1) : NOT_RECORDED);

const nextVisitOf = (checklist: Checklist): string => {
  if (checklist.nextScheduledDate) return formatCalendarDay(checklist.nextScheduledDate);
  if (checklist.nextProposedDate) return `Proposed ${formatCalendarDay(checklist.nextProposedDate)}, not reserved`;
  return "Not reserved";
};

const ageOf = ({ months, days }: Checklist["baby"]["age"]): string =>
  `${months} ${months === 1 ? "month" : "months"} and ${days} ${days === 1 ? "day" : "days"}`;

type LinkedBaby = { _id: string; name: string; dateOfBirth: string };

const linkedBaby = (baby: LinkedBaby, record: MedicalRecord, checklist: Checklist | null): PersonSummary => {
  const nameNote = checklist?.baby.temporaryName ? " (temporary name)" : "";
  // A visit record has no program state of its own, so this reads the baby's program record.
  const status = immunizationProgressLabel(checklist?.medicalRecord ?? record);
  return {
    title: "Baby",
    rows: [
      { label: "Name", value: `${baby.name || NOT_RECORDED}${nameNote}` },
      { label: "Date of birth", value: formatCalendarDay(baby.dateOfBirth) },
      ...(checklist ? [{ label: "Age", value: ageOf(checklist.baby.age) }] : []),
      { label: "Baby ID", value: baby._id },
      ...(checklist?.baby.birthRecordId ? [{ label: "Birth record", value: checklist.baby.birthRecordId }] : []),
      ...(checklist ? [{ label: "Next visit", value: nextVisitOf(checklist) }] : []),
      ...(status ? [{ label: "Program status", value: status }] : []),
    ],
  };
};

/** A visit booked for a child names them on the appointment, with no ledger link. */
const childOnAppointment = (record: MedicalRecord): PersonSummary | null => {
  const appointment = typeof record.appointment === "object" ? record.appointment : null;
  const name = appointment?.childName?.trim();
  if (!name) return null;
  return {
    title: "Baby",
    rows: [
      { label: "Name", value: name },
      { label: "Date of birth", value: formatCalendarDay(appointment?.childDateOfBirth) },
    ],
  };
};

const babyOf = (record: MedicalRecord, checklist: Checklist | null): PersonSummary => {
  const id = babyIdOf(record) ?? checklist?.baby._id ?? null;
  const stored = typeof record.immunizationBabyId === "object" ? record.immunizationBabyId : null;
  if (id) return linkedBaby({ _id: id, name: checklist?.baby.name ?? stored?.name ?? "", dateOfBirth: stored?.dateOfBirth ?? checklist?.baby.dateOfBirth ?? "" }, record, checklist);
  return childOnAppointment(record) ?? { title: "Baby", rows: [], emptyText: NOT_LINKED };
};

/** Staff see the master list identity the record is filed under. */
export const peopleFromMasterlist = (detail: MasterlistDetail, checklist: Checklist | null) => {
  const { resident, linkage } = detail;
  const masterId = resident.masterResidentId ?? checklist?.mother.masterResidentId;
  const parent: PersonSummary = {
    title: babyIdOf(detail.record) || checklist ? "Mother" : "Resident",
    rows: [
      { label: "Name", value: resident.fullName || NOT_RECORDED },
      { label: "Birth date", value: formatCalendarDay(resident.dateOfBirth) },
      { label: "Sex", value: capitalize(resident.sex) },
      ...(resident.purok ? [{ label: "Purok", value: resident.purok }] : []),
      ...(masterId ? [{ label: "Master list ID", value: masterId }] : []),
      { label: "Account", value: LINKAGE_PILLS[linkage].label },
    ],
  };
  return { parent, baby: babyOf(detail.record, checklist) };
};

/** Records read outside the master list carry the account holder, not a master list identity. */
export const peopleFromRecord = (record: MedicalRecord, checklist: Checklist | null, signedInName: string) => {
  const account = typeof record.resident === "object" ? record.resident : null;
  const baby = babyOf(record, checklist);
  const onLedger = Boolean(babyIdOf(record) || checklist);
  const parent: PersonSummary = {
    title: onLedger ? "Mother" : baby.rows.length ? "Parent" : "Patient",
    rows: [
      { label: "Name", value: checklist?.mother.name || account?.fullname || signedInName || NOT_RECORDED },
      ...(account?.dateOfBirth ? [{ label: "Birth date", value: formatCalendarDay(account.dateOfBirth) }] : []),
      ...(checklist ? [{ label: "Mother ID", value: checklist.mother.masterResidentId }] : []),
      ...(checklist ? [{ label: "Account", value: checklist.accountLinked ? "Linked" : "Not linked" }] : []),
    ],
  };
  return { parent, baby };
};
