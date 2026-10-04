import ConfirmationModal from "@/components/ui/ConfirmationModal";

import type { MasterListScreenState } from "../hooks/useMasterListScreen";
import MasterResidentEditorDialog from "./MasterResidentEditorDialog";

/** The add/edit dialog and the activation confirmation for the master list tab. */
const MasterListOverlays = ({ screen }: { screen: MasterListScreenState }) => {
  const { editor, confirming, confirmName } = screen;
  const deactivating = Boolean(confirming?.isActive);

  return (
    <>
      {editor ? (
        <MasterResidentEditorDialog
          editing={editor === "new" ? null : editor}
          onClose={screen.closeEditor}
          onSaved={screen.list.refresh}
        />
      ) : null}
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
