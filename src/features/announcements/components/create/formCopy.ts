type DialogCopy = {
  title: string;
  subtitle: string;
  submit: string;
  submitting: string;
  note: string;
};

const POSTING_NOTE =
  "Selected active accounts will receive notifications, and this announcement will also appear on the announcements page.";

export const dialogCopy = (isEditing: boolean, canChooseDraft: boolean): DialogCopy => {
  if (isEditing && !canChooseDraft) {
    return {
      title: "Edit announcement",
      subtitle: "Update what people have already received.",
      submit: "Save changes",
      submitting: "Saving…",
      note: "Saving updates the notification people already received. Nobody is notified again.",
    };
  }
  return {
    title: isEditing ? "Edit draft" : "New announcement",
    subtitle: isEditing ? "Finish this update, then post it or keep it as a draft." : "Create an update for your community.",
    submit: "Post announcement",
    submitting: "Posting…",
    note: POSTING_NOTE,
  };
};

export const AUDIENCE_SCHEDULE_HELPER = "Choose who will see this announcement and when the event happens.";
// The date is the event's. Posting is what reaches people, so the form says so beside the date.
export const SCHEDULE_HELPER = "The date and time of the event. People are notified as soon as you post, not at this time.";
