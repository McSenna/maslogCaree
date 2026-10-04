import type { MasterlistScreenState } from "../hooks/useMasterlistScreen";
import RecordDetailDialog from "./detail/RecordDetailDialog";
import RecordEditorDialog from "./editor/RecordEditorDialog";

/** The editor and the record detail. A detail opened from the duplicate warning sits above the editor. */
const MasterlistOverlays = ({ screen }: { screen: MasterlistScreenState }) => {
  const { editor, detail } = screen;
  return (
    <>
      {editor ? (
        <RecordEditorDialog
          editing={editor === "new" ? null : editor}
          forms={screen.serviceForms.forms}
          formsLoading={screen.serviceForms.loading}
          onClose={screen.closeEditor}
          onSaved={screen.onSaved}
          onViewRecord={detail.open}
        />
      ) : null}
      <RecordDetailDialog
        detail={detail}
        onEdit={editor ? undefined : screen.openEdit}
        onShowHistory={editor ? undefined : screen.showHistory}
      />
    </>
  );
};

export default MasterlistOverlays;
