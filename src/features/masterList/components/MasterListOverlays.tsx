import ConfirmationModal from "@/components/ui/ConfirmationModal";

import { masterFullName } from "../masterResidentForm";

import type { MasterListScreenState } from "../hooks/useMasterListScreen";
import MasterResidentEditorDialog from "./MasterResidentEditorDialog";
import ResidentDetailsDialog from "../residentDetails/ResidentDetailsDialog";

/** View, editor and deletion confirmation for the master list tab. */
const MasterListOverlays = ({ screen }: { screen: MasterListScreenState }) => {
  const { editor, viewingId } = screen;

  return (
    <>
      {viewingId ? (
        <ResidentDetailsDialog key={viewingId} recordId={viewingId} onClose={screen.closeView} onEdit={screen.editFromView} />
      ) : null}
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
    </>
  );
};

export default MasterListOverlays;
