import type { AgeSlot, Baby, Dose, Mother, ProgressStatus, RecordProgress, RecordTab, Vaccine } from "./types.ts";

export const AGE_SLOTS: readonly { key: AgeSlot; label: string }[] = [
  { key: "birth", label: "At birth" },
  { key: "6w", label: "6 weeks" },
  { key: "10w", label: "10 weeks" },
  { key: "14w", label: "14 weeks" },
  { key: "9m", label: "9 months" },
  { key: "12m", label: "12 months" },
];

export const ageLabelOf = (slot: AgeSlot): string =>
  AGE_SLOTS.find((item) => item.key === slot)?.label ?? slot;

const TAB_ORDER: readonly RecordTab[] = ["vaccinations", "visit", "notes", "history"];

const STATUS_LABELS: Record<ProgressStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  complete: "Complete",
};

const NOT_RECORDED = "Not recorded";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ID_HEAD = 8;
const ID_TAIL = 5;

export const progressOf = (vaccines: readonly Vaccine[]): RecordProgress => {
  const scheduled = vaccines.flatMap((vaccine) => vaccine.doses).filter((dose) => dose.status !== "not_scheduled");
  const completed = scheduled.filter((dose) => dose.status === "completed").length;
  const total = scheduled.length;
  const status: ProgressStatus = completed === 0 ? "not_started" : completed === total ? "complete" : "in_progress";
  return { completed, total, status, statusLabel: STATUS_LABELS[status], summary: `${completed} of ${total} doses recorded` };
};

// Read as a plain calendar day. Going through Date in local time can shift it by a day.
export const formatRecordDate = (day: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(day);
  if (!match) return NOT_RECORDED;
  const [year, month, date] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const parsed = new Date(Date.UTC(year, month - 1, date));
  if (parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== date) return NOT_RECORDED;
  return `${MONTHS[month - 1]} ${date}, ${year}`;
};

export const truncateMiddle = (id: string): string =>
  id.length <= ID_HEAD + ID_TAIL ? id : `${id.slice(0, ID_HEAD)}…${id.slice(-ID_TAIL)}`;

export const doseAt = (vaccine: Vaccine, slot: AgeSlot): Dose | null => {
  const dose = vaccine.doses.find((item) => item.slot === slot);
  return dose && dose.status !== "not_scheduled" ? dose : null;
};

export const scheduledDoses = (vaccine: Vaccine): Dose[] =>
  vaccine.doses.filter((dose) => dose.status !== "not_scheduled");

export const doseSpokenLabel = (vaccine: string, age: string, dose: Dose | null): string => {
  if (!dose) return `${vaccine}, ${age}: Not scheduled`;
  const state =
    dose.status === "completed" ? `administered ${formatRecordDate(dose.administeredOn ?? "")}` : "requires review";
  return `${vaccine}, ${age}: ${dose.label}, ${state}`;
};

export const babyMeta = (baby: Baby): string[] => [
  `DOB: ${formatRecordDate(baby.dob)}`,
  `Sex: ${baby.sex || NOT_RECORDED}`,
  `ID: ${truncateMiddle(baby.id)}`,
];

export const motherMeta = (mother: Mother): string[] => [
  `DOB: ${formatRecordDate(mother.dob)}`,
  `${mother.sex}, ${mother.purok}`,
  `Master list: ${mother.masterListId}`,
  mother.hasLinkedAccount ? "Linked account" : "No linked account",
];

export const nextTab = (current: RecordTab, key: string): RecordTab | null => {
  const index = TAB_ORDER.indexOf(current);
  const last = TAB_ORDER.length - 1;
  if (key === "ArrowRight") return TAB_ORDER[index === last ? 0 : index + 1];
  if (key === "ArrowLeft") return TAB_ORDER[index === 0 ? last : index - 1];
  if (key === "Home") return TAB_ORDER[0];
  if (key === "End") return TAB_ORDER[last];
  return null;
};
