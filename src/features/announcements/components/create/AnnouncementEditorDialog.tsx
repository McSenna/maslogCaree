import { useCallback } from "react";
import { View } from "react-native";

import { toast } from "@/components/feedback";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import { DialogActions, InlineError } from "@/components/ui/dialog/DialogPieces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { useDialogPresentation } from "@/hooks/useDialogPresentation";

import type { AnnouncementRecord } from "../../announcement.types";
import type { EditableAnnouncement } from "../../announcementFormValues";
import { useAnnouncementForm } from "../../hooks/useAnnouncementForm";
import AnnouncementForm from "./AnnouncementForm";
import { dialogCopy } from "./formCopy";

type AnnouncementEditorDialogProps = {
  /** The announcement to edit; null writes a new one. */
  editing: EditableAnnouncement | null;
  onClose: () => void;
  onSaved: (announcement: AnnouncementRecord) => void;
};

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
 * Create or edit, centred from tablet width up and a bottom sheet on phones;
 * `ResponsiveDialog` makes that choice and owns focus, Escape, scroll lock and
 * keyboard insets. Mounted only while open, so each opening starts from the
 * announcement it was opened for.
 */
const AnnouncementEditorDialog = ({ editing, onClose, onSaved }: AnnouncementEditorDialogProps) => {
  const palette = useResidentDialogPalette();
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

  const form = useAnnouncementForm({ editing, onSaved: handleSaved, onFailed: handleFailed });
  const copy = dialogCopy(form.values, form.isEditing, form.canChooseDraft);

  return (
    <ResponsiveDialog
      visible
      title={copy.title}
      icon={form.isEditing ? "edit-2" : "volume-2"}
      maxWidth={600}
      onClose={onClose}
      footer={
        <View style={{ gap: 10 }}>
          {form.submitError ? <InlineError palette={palette} message={form.submitError} /> : null}
          <DialogActions
            palette={palette}
            secondaryLabel="Cancel"
            onSecondary={onClose}
            primaryLabel={form.submitting ? copy.submitting : copy.submit}
            onPrimary={() => void form.submit()}
            busy={form.submitting}
            icon={form.values.isDraft || (form.isEditing && !form.canChooseDraft) ? "check" : "send"}
          />
        </View>
      }
    >
      <AnnouncementForm form={form} compact={compact} />
    </ResponsiveDialog>
  );
};

export default AnnouncementEditorDialog;
