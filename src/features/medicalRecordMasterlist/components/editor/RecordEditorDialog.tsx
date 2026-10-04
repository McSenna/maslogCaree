import { useState } from "react";

import CompleteModalShell, { PANEL_TWO_COLUMN_WIDTH } from "@/components/medicalRecord/complete/CompleteModalShell";
import { CompletionPlaceholder } from "@/components/medicalRecord/complete/CompletionChrome";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import DateOfBirthPicker from "@/features/auth/components/datePicker/DateOfBirthPicker";
import type { CompletionForm } from "@/services/medicalRecords";

import { useRecordEditor } from "../../hooks/useRecordEditor";
import type { MasterlistDetail } from "../../types";
import EditorFooter from "./editorFooter";
import RecordEditorForm from "./RecordEditorForm";

type Props = {
  editing: MasterlistDetail | null;
  forms: CompletionForm[];
  formsLoading: boolean;
  onClose: () => void;
  onSaved: (detail: MasterlistDetail) => void;
  onViewRecord: (id: string) => void;
};

// A visit is recent more often than not, so the calendar opens on this month.
const thisMonth = () => ({ year: new Date().getFullYear(), monthIndex: new Date().getMonth() });

/**
 * Add or edit an encoded medical record in one form: a centred card on wide
 * screens, a bottom sheet on phones. Mounted only while open, so every opening
 * starts clean. The calendar is a sibling of the shell, not a child, so an
 * Android dialog recreation cannot reset it.
 */
const RecordEditorDialog = ({ editing, forms, formsLoading, onClose, onSaved, onViewRecord }: Props) => {
  const editor = useRecordEditor({ editing, forms, onSaved, onDone: onClose });
  const [panelWidth, setPanelWidth] = useState(0);
  const [pickingDate, setPickingDate] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  // Readings typed from a paper record are easy to lose; ask before dropping them.
  const requestClose = () => (editor.hasUnsavedInput ? setConfirmingDiscard(true) : onClose());
  const duplicate = editor.duplicate;
  const waitingForForms = formsLoading && !editing && forms.length === 0;

  return (
    <>
      <CompleteModalShell
        visible
        onRequestClose={requestClose}
        dismissible={!editor.saving}
        closeLabel="Close without saving"
        onLayoutWidth={setPanelWidth}
        scrollToTopKey={editor.nextCount}
        title={editing ? "Edit medical record" : "Add medical record"}
        subtitle={editor.resident?.fullName ?? "A record from the health center's files"}
        footer={<EditorFooter editor={editor} onClose={requestClose} />}
      >
        {waitingForForms ? (
          <CompletionPlaceholder message="Loading the record forms." />
        ) : (
          <RecordEditorForm editor={editor} forms={forms} twoColumn={panelWidth >= PANEL_TWO_COLUMN_WIDTH} onOpenDate={() => setPickingDate(true)} />
        )}
      </CompleteModalShell>

      <DateOfBirthPicker
        visible={pickingDate}
        value={editor.visit.visitDate}
        onConfirm={(isoDate) => editor.setVisitField("visitDate", isoDate)}
        onClose={() => setPickingDate(false)}
        opensAt={thisMonth()}
        title="Select visit date"
        confirmLabel="Confirm visit date"
      />

      <ConfirmationModal
        visible={confirmingDiscard}
        title={editing ? "Discard your changes?" : "Discard this record?"}
        message="The details you have entered will not be saved."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        destructive
        onConfirm={onClose}
        onCancel={() => setConfirmingDiscard(false)}
      />

      <ConfirmationModal
        visible={duplicate !== null}
        title="This medical record may already exist"
        message={`A ${editor.form?.label ?? "record"} for ${editor.resident?.fullName ?? "this resident"} on this date is already on file. Review the existing record before continuing. Save anyway only if this was a second visit that day.`}
        confirmLabel="Save anyway"
        cancelLabel={duplicate?.existingId ? "View existing record" : "Go back"}
        onConfirm={() => {
          editor.dismissDuplicate();
          editor.submit(true);
        }}
        onCancel={() => {
          const existingId = duplicate?.existingId;
          editor.dismissDuplicate();
          if (existingId) onViewRecord(existingId);
        }}
      />
    </>
  );
};

export default RecordEditorDialog;
