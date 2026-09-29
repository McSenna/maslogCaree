import { useCallback } from "react";
import { View } from "react-native";

import { toast } from "@/components/feedback";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import { DialogActions, InlineError } from "@/components/ui/dialog/DialogPieces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { useDialogPresentation } from "@/hooks/useDialogPresentation";
import { useLatestRef } from "@/hooks/useLatestRef";

import type { AnnouncementRecord } from "../../announcement.types";
import { useCreateAnnouncementForm } from "../../hooks/useCreateAnnouncementForm";
import AnnouncementForm from "./AnnouncementForm";

type CreateAnnouncementDialogProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: (announcement: AnnouncementRecord) => void;
};

const recipientLine = (count: number | undefined): string =>
  count === undefined
    ? "It is now on the announcements page."
    : count === 0
      ? "It is on the announcements page. No other active accounts to notify yet."
      : `Sent to ${count} ${count === 1 ? "account" : "accounts"} in the app.`;

/**
 * Centred modal from tablet width up, bottom sheet on phones; `ResponsiveDialog`
 * makes that choice and owns focus, Escape, scroll lock and keyboard insets.
 *
 * Keep this mounted while its screen is: the form state lives here, so closing
 * mid-request neither loses the typed values nor the outcome of the request.
 */
const CreateAnnouncementDialog = ({ visible, onClose, onCreated }: CreateAnnouncementDialogProps) => {
  const palette = useResidentDialogPalette();
  const compact = useDialogPresentation() === "sheet";
  const visibleRef = useLatestRef(visible);

  const handleCreated = useCallback(
    (announcement: AnnouncementRecord) => {
      toast.success("Announcement posted", recipientLine(announcement.recipientCount));
      onCreated(announcement);
      onClose();
    },
    [onClose, onCreated]
  );

  // Inside the dialog the error shows above the buttons; once closed, a toast carries it.
  const handleFailed = useCallback(
    (message: string) => {
      if (!visibleRef.current) toast.error("Announcement not posted", message);
    },
    [visibleRef]
  );

  const form = useCreateAnnouncementForm({ onCreated: handleCreated, onFailed: handleFailed });

  // Closing never cancels a request already sent; while one is in flight the
  // typed values are kept so a failure can be fixed after reopening.
  const handleClose = useCallback(() => {
    if (!form.submitting) form.reset();
    onClose();
  }, [form, onClose]);

  if (!visible) return null;

  return (
    <ResponsiveDialog
      visible
      title="New announcement"
      icon="volume-2"
      maxWidth={600}
      onClose={handleClose}
      footer={
        <View style={{ gap: 10 }}>
          {form.submitError ? <InlineError palette={palette} message={form.submitError} /> : null}
          <DialogActions
            palette={palette}
            secondaryLabel="Cancel"
            onSecondary={handleClose}
            primaryLabel={form.submitting ? "Posting…" : "Post announcement"}
            onPrimary={() => void form.submit()}
            busy={form.submitting}
            icon="send"
          />
        </View>
      }
    >
      <AnnouncementForm form={form} compact={compact} />
    </ResponsiveDialog>
  );
};

export default CreateAnnouncementDialog;
