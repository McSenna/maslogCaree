import type { FeatherName } from "@/components/data-table";

import type { VaccinationRecordState } from "./useVaccinationRecord";

type EmptyCopy = { icon: FeatherName; title: string; description: string };

/** What each tab says when it has no doses to show, and why. */
export const vaccinationEmptyCopy = (view: VaccinationRecordState): EmptyCopy => {
  if (view.restricted) {
    const counted = view.counts ? `This record shows ${view.counts.administered} of ${view.counts.total} doses administered. ` : "";
    return {
      icon: "lock",
      title: "Dose details are limited",
      description: `${counted}Only the midwife and the baby's verified mother can open each dose.`,
    };
  }
  if (view.scope === "ledger_visit" && !view.checklist) {
    return {
      icon: "book-open",
      title: "Doses are in the baby's checklist",
      description: "This older visit is not linked to one baby, so its doses are not shown here. They remain in the immunization checklist.",
    };
  }
  if (view.scope === "single_visit") {
    return { icon: "shield", title: "No vaccine details on this record", description: "This record was saved without a vaccine name, dose or date." };
  }
  return {
    icon: "shield",
    title: "No vaccinations recorded yet",
    description: "Doses appear here once the midwife records them. Scheduled doses are not listed until then.",
  };
};
