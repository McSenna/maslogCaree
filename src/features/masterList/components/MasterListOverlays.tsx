import ConfirmationModal from "@/components/ui/ConfirmationModal";

import { masterFullName } from "../masterResidentForm";

import type { MasterListScreenState } from "../hooks/useMasterListScreen";
import MasterResidentEditorDialog from "./MasterResidentEditorDialog";

/** Editor, deletion and activation confirmations for the master list tab. */
const MasterListOverlays = ({ screen }: { screen: MasterListScreenState }) => {
  const { editor, confirming, confirmName } = screen;
  const deactivating = Boolean(confirming?.isActive);

  return (
    <>
      {editor ? (
        <MasterResidentEditorDialog
          editing={editor === "new" ? null : editor}
          onClose={screen.closeEditor}
          onSaved={screen.saved}
        />
      ) : null}
      <ConfirmationModal
        visible={Boolean(screen.deleting)}
        title="Delete this record?"
        message={`${screen.deleting ? masterFullName(screen.deleting) : ""} (${screen.deleting?.masterResidentId}) will be removed from the Master List and will no longer match new sign-ups. The official record, linked accounts and medical history are retained. You cannot restore it from this screen.`}
        confirmLabel="Delete"
        destructive
        focusCancel
        loading={screen.removing}
        error={screen.deleteError}
        onConfirm={() => void screen.remove()}
        onCancel={screen.cancelDelete}
      />
      <ConfirmationModal
        visible={Boolean(confirming)}
        title={deactivating ? "Deactivate this record?" : "Reactivate this record?"}
        message={
          deactivating
            ? `${confirmName} (${confirming?.masterResidentId}) will stop matching new sign-ups. Any linked app account keeps working. You can reactivate the record anytime.`
            : `${confirmName} (${confirming?.masterResidentId}) will match new sign-ups again.`
        }
        confirmLabel={deactivating ? "Deactivate record" : "Reactivate record"}
        destructive={deactivating}
        loading={screen.toggling}
        onConfirm={() => void screen.toggleActive()}
        onCancel={screen.cancelToggle}
      />
    </>
  );
};

export default MasterListOverlays;
