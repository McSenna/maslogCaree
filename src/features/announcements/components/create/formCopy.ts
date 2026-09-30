import type { AnnouncementFormValues, Audience } from "../../announcement.types";

const WHO: Record<Audience, string> = {
  Patients: "Patients with an approved account",
  Staff: "Health staff and admins",
  Everyone: "Every active MaslogCare account",
};

/** The line above the form: who hears about this, and when. */
export const formIntro = (values: AnnouncementFormValues, isEditing: boolean, canChooseDraft: boolean): string => {
  if (values.isDraft) return "Only admins can see a draft. Nobody is notified until you post it.";
  if (isEditing && !canChooseDraft) {
    return "Saving updates the notification people already received. Nobody is notified again.";
  }
  return `${WHO[values.audience]} will get this in their notifications, and it stays on the announcements page.`;
};

type DialogCopy = { title: string; submit: string; submitting: string };

export const dialogCopy = (values: AnnouncementFormValues, isEditing: boolean, canChooseDraft: boolean): DialogCopy => {
  if (values.isDraft) return { title: isEditing ? "Edit draft" : "New announcement", submit: "Save draft", submitting: "Saving…" };
  if (isEditing && !canChooseDraft) return { title: "Edit announcement", submit: "Save changes", submitting: "Saving…" };
  return { title: isEditing ? "Edit draft" : "New announcement", submit: "Post announcement", submitting: "Posting…" };
};
