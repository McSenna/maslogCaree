import { useCallback } from "react";

import { toast } from "@/components/feedback";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import { useDialogPresentation } from "@/hooks/useDialogPresentation";
import { RADII } from "@/theme/radius";
import { showAlert } from "@/utils/notify";

import type { AnnouncementRecord, AnnouncementSubmitPayload } from "../../announcement.types";
import type { EditableAnnouncement } from "../../announcementFormValues";
import { useAnnouncementForm } from "../../hooks/useAnnouncementForm";
import AnnouncementEditorFooter from "./AnnouncementEditorFooter";
import AnnouncementForm from "./AnnouncementForm";
import { dialogCopy } from "./formCopy";

export type AnnouncementEditorDialogProps = {
  /** The announcement to edit; null writes a new one. */
  editing: EditableAnnouncement | null;
  onClose: () => void;
  /** Saves the announcement. A rejection keeps the form open with the person's input. */
  onSubmit: (payload: AnnouncementSubmitPayload) => Promise<AnnouncementRecord>;
  onSaved: (announcement: AnnouncementRecord) => void;
};

const MAX_WIDTH = 930;
const SHEET_HEIGHT_RATIO = 1;

const recipientLine = (count: number | undefined): string =>
  count === undefined
    ? "It is now on the announcements page."
    : count === 0
      ? "It is on the announcements page. No other active accounts to notify yet."
      : `Sent to ${count} ${count === 1 ? "account" : "accounts"} in the app.`;

const savedToast = (saved: AnnouncementRecord, wasEditing: boolean, wasDraft: boolean) => {
  if (saved.isDraft) return toast.success("Draft saved", "Only admins can see it until you post it.");
  if (wasEditing && !wasDraft) return toast.success("Announcement updated", "Notifications already sent now show the change.");
  return toast.success("Announcement posted", recipientLine(saved.recipientCount));
};

/**
 * Create or edit, centred from tablet width up and a full-height sheet on
 * phones; `ResponsiveDialog` makes that choice and owns focus, Escape, scroll
 * lock and keyboard insets. Mounted only while open, so each opening starts
 * from the announcement it was opened for.
 */
const AnnouncementEditorDialog = ({ editing, onClose, onSubmit, onSaved }: AnnouncementEditorDialogProps) => {
  const compact = useDialogPresentation() === "sheet";

  const handleSaved = useCallback(
    (saved: AnnouncementRecord) => {
      savedToast(saved, Boolean(editing), Boolean(editing?.isDraft));
      onSaved(saved);
      onClose();
    },
    [editing, onClose, onSaved]
  );

  // The reason shows above the buttons, so the toast only names what failed.
  const handleFailed = useCallback(() => {
    toast.error(editing ? "Changes not saved" : "Announcement not posted");
  }, [editing]);

  const form = useAnnouncementForm({ editing, onSubmit, onSaved: handleSaved, onFailed: handleFailed });
  const copy = dialogCopy(form.isEditing, form.canChooseDraft);

  // True when closing was stopped: a save is running, or there is input to confirm losing.
  const holdClose = (): boolean => {
    if (form.submitting) return true;
    if (!form.hasUnsavedInput) return false;
    showAlert(editing ? "Discard your changes?" : "Discard this announcement?", "The details you have entered will not be saved.", [
      { text: "Keep editing", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: onClose },
    ]);
    return true;
  };

  const requestClose = () => {
    if (!holdClose()) onClose();
  };

  return (
    <ResponsiveDialog
      visible
      title={copy.title}
      subtitle={copy.subtitle}
      icon={form.isEditing ? "edit-2" : "volume-2"}
      maxWidth={MAX_WIDTH}
      radius={RADII.medium}
      sheetHeightRatio={SHEET_HEIGHT_RATIO}
      flush
      onClose={requestClose}
      onDismissRequest={holdClose}
      footer={
        <AnnouncementEditorFooter
          form={form}
          compact={compact}
          note={copy.note}
          submitLabel={copy.submit}
          submittingLabel={copy.submitting}
          submitIcon={form.canChooseDraft ? "send" : "check"}
          onCancel={requestClose}
        />
      }
    >
      <AnnouncementForm form={form} compact={compact} maxWidth={MAX_WIDTH} />
    </ResponsiveDialog>
  );
};

export default AnnouncementEditorDialog;
