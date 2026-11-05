import type { MasterlistScreenState } from "../hooks/useMasterlistScreen";
import RecordDeletionDialog from "./RecordDeletionDialog";
import RecordDetailDialog from "./detail/RecordDetailDialog";
import RecordEditorDialog from "./editor/RecordEditorDialog";

/** The editor and the record detail. A detail opened from the duplicate warning sits above the editor. */
const MasterlistOverlays = ({ screen }: { screen: MasterlistScreenState }) => {
  const { editor, detail } = screen;
  return (
    <>
      {screen.canWriteRecords ? <RecordDeletionDialog deletion={screen.deletion} /> : null}
      {screen.canWriteRecords && editor ? (
        <RecordEditorDialog
          initialServiceType={screen.initialServiceType}
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
        onEdit={screen.canWriteRecords && !editor ? screen.openEdit : undefined}
        onShowHistory={editor ? undefined : screen.showHistory}
        onOpenProgram={editor || !screen.editImmunization ? undefined : (id) => void screen.editImmunization?.(id)}
      />
    </>
  );
};

export default MasterlistOverlays;
