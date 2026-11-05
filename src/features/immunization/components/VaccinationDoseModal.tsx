import { useRef, useState } from "react";
import CompleteModalShell from "@/components/medicalRecord/complete/CompleteModalShell";
import { useAuth } from "@/contexts/AuthContext";
import { useClinicalDraft, useClinicalTransition } from "../hooks/useClinicalDraft";
import useDoseEntry from "../hooks/useDoseEntry";
import useFollowUpEntry from "../hooks/useFollowUpEntry";
import type { DoseEntryField } from "../immunizationLogic";
import { isAdministered } from "../immunizationLogic";
import type { Checklist, DoseView } from "../types";
import DoseDetails from "./DoseDetails";
import DoseForm, { type DoseFormSection } from "./DoseForm";
import DoseModalFooter from "./DoseModalFooter";

type Props = {
  checklist: Checklist;
  dose: DoseView;
  canEdit: boolean;
  onSaved: () => Promise<void>;
  onClose: () => void;
};

const MAX_WIDTH = 760;
const CHECK_FIELDS = "Check the highlighted fields before saving.";
const NO_CLINICIAN = "We could not confirm your midwife account. Sign in again before saving this dose.";
const SECTION_OF: Record<DoseEntryField, DoseFormSection> = {
  reason: "correction",
  administeredOn: "vaccination",
  administeredAt: "vaccination",
  administeredBy: "administration",
};

/**
 * One dose, above the grid. Mounted per selection and keyed by baby and dose, so
 * nothing typed for one dose can reach another. Saving keeps it open on any
 * failure, with the entered values intact.
 */
const VaccinationDoseModal = ({ checklist, dose, canEdit, onSaved, onClose }: Props) => {
  const transition = useClinicalTransition();
  const { user } = useAuth();
  // Read on every render, so a different account can never see the last one's name.
  const signedInName = user?.role === "midwife" ? (user.name?.trim() ?? "") : "";
  const unconfirmed = !signedInName;
  const entry = useDoseEntry(checklist, dose, onSaved, onClose);
  const followUp = useFollowUpEntry(entry.patient, entry.saving, entry.finish);
  const changed = useClinicalDraft({ administration: entry.administration, reason: entry.reason, followUp: followUp.values });
  const [editing, setEditing] = useState(!dose.record);
  const sectionY = useRef<Partial<Record<DoseFormSection, number>>>({});
  const [scroll, setScroll] = useState({ key: 0, y: 0 });
  const { saving, completed, reviewing, action, mode } = entry;
  const vaccine = checklist.schedule.vaccines.find((item) => item.key === dose.vaccineKey)?.name ?? dose.vaccineKey;
  // Asks only about this modal's own input. A draft elsewhere in the editor is not lost by closing it.
  const leave = (action: () => void) => (changed ? transition(action) : action());
  const close = () => leave(onClose);
  const cancel = { label: "Cancel", onPress: close, disabled: saving.saving };

  const submit = () => {
    const field = entry.submit();
    if (field) setScroll((current) => ({ key: current.key + 1, y: sectionY.current[SECTION_OF[field]] ?? 0 }));
  };
  const hasFieldErrors = Object.values(entry.errors).some(Boolean) || Object.values(followUp.errors).some(Boolean);
  const problem = unconfirmed ? NO_CLINICIAN : saving.error
    ? `${saving.error} Your entry is still here. Reload to confirm the current record before retrying.`
    : hasFieldErrors ? CHECK_FIELDS : undefined;

  const footer = () => {
    if (!editing) {
      const record = dose.record;
      const editLabel = isAdministered(record) ? "Edit saved record" : record?.workflowStatus === "draft" ? "Edit draft" : "Update dose record";
      return <DoseModalFooter cancel={{ label: "Close", onPress: close }} primary={canEdit ? { label: editLabel, onPress: () => setEditing(true) } : undefined} />;
    }
    const failure = { problem, onReload: saving.error ? () => leave(() => void entry.finish()) : undefined };
    if (reviewing) {
      return (
        <DoseModalFooter
          {...failure}
          cancel={{ label: "Edit entry", onPress: () => entry.setReviewing(false), disabled: saving.saving }}
          primary={{ label: action === "void" ? "Confirm void" : "Save correction", onPress: entry.save, loading: saving.saving, disabled: unconfirmed }}
        />
      );
    }
    if (completed) {
      return <DoseModalFooter {...failure} cancel={cancel} primary={{ label: action === "void" ? "Review void" : "Review correction", onPress: submit, disabled: saving.saving || unconfirmed }} />;
    }
    if (mode === "follow-up") {
      return <DoseModalFooter {...failure} cancel={cancel} primary={{ label: "Save follow-up", onPress: followUp.save, loading: saving.saving, disabled: unconfirmed }} />;
    }
    return (
      <DoseModalFooter
        {...failure}
        cancel={cancel}
        secondary={{ label: "Save Draft", onPress: entry.saveDraft, disabled: saving.saving || unconfirmed }}
        primary={{ label: "Save Vaccination Details", onPress: submit, loading: saving.saving, disabled: unconfirmed }}
      />
    );
  };

  return (
    <CompleteModalShell
      visible
      onRequestClose={close}
      dismissible={!saving.saving}
      closeLabel="Close vaccination dose details"
      title="Vaccination Dose Details"
      subtitle={`${vaccine}, ${dose.label}. ${checklist.baby.name}`}
      subtitleLines={3}
      footer={footer()}
      maxWidth={MAX_WIDTH}
      scrollToTopKey={scroll.key}
      scrollToY={scroll.y}
    >
      {editing ? (
        <DoseForm
          checklist={checklist}
          dose={dose}
          entry={entry}
          followUp={followUp}
          signedInName={signedInName}
          onSectionLayout={(section, y) => { sectionY.current[section] = y; }}
        />
      ) : (
        <DoseDetails checklist={checklist} dose={dose} />
      )}
    </CompleteModalShell>
  );
};
export default VaccinationDoseModal;
