import { useEffect } from "react";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import CompleteModalShell from "@/components/medicalRecord/complete/CompleteModalShell";
import useDoseEntry from "../hooks/useDoseEntry";
import { useClinicalDraft, useClinicalTransition } from "../hooks/useClinicalDraft";
import type { Checklist, DoseView } from "../types";
import ClinicalDetailsFields from "./ClinicalDetailsFields";
import ClinicalField from "./ClinicalField";
import DoseIdentity from "./DoseIdentity";
import DoseTiming from "./DoseTiming";
import DoseReview from "./DoseReview";
import FollowUpForm from "./FollowUpForm";
import useImmunizationStyles from "./immunizationStyles";

const DoseForm = ({
  checklist,
  dose,
  onSaved,
  onClose,
  onRequestClose = onClose,
  embedded = false,
  onContentChange,
}: {
  checklist: Checklist;
  dose: DoseView;
  onSaved: () => Promise<void>;
  onClose: () => void;
  onRequestClose?: () => void;
  embedded?: boolean;
  onContentChange?: () => void;
}) => {
  const { styles } = useImmunizationStyles();
  const entry = useDoseEntry(checklist, dose, onSaved, onClose);
  useClinicalDraft({ administration: entry.administration, reason: entry.reason });
  const transition = useClinicalTransition();
  const { completed, mode, setMode, reviewing, saving, action, setAction } =
    entry;
  useEffect(() => {
    if (reviewing) onContentChange?.();
  }, [reviewing, onContentChange]);
  const body = (
    <View style={styles.section}>
      <DoseIdentity checklist={checklist} dose={dose} />
      <DoseTiming dose={dose} />
      {!completed && !reviewing ? (
        <View style={styles.row}>
          <Button
            label="Record administration"
            variant={mode === "administration" ? "primary" : "secondary"}
            onPress={() => mode === "follow-up" ? transition(() => setMode("administration")) : setMode("administration")}
            disabled={saving.saving}
          />
          <Button
            label="Plan follow-up"
            variant={mode === "follow-up" ? "primary" : "secondary"}
            onPress={() => setMode("follow-up")}
            disabled={saving.saving}
          />
        </View>
      ) : null}
      {mode === "follow-up" && !completed ? (
        <FollowUpForm
          patient={entry.patient}
          saving={saving}
          onSaved={entry.finish}
        />
      ) : reviewing ? (
        <DoseReview entry={entry} />
      ) : (
        <View style={styles.section}>
          {completed ? (
            <>
              <View style={styles.row}>
                <Button
                  label="Correct record"
                  variant={action === "correct" ? "primary" : "secondary"}
                  onPress={() => setAction("correct")}
                />
                <Button
                  label="Void record"
                  variant={action === "void" ? "primary" : "secondary"}
                  onPress={() => setAction("void")}
                />
              </View>
              <ClinicalField
                label="Reason for correction or void"
                value={entry.reason}
                onChange={entry.setReason}
                required
                multiline
              />
            </>
          ) : null}
          {action !== "void" ? (
            <ClinicalDetailsFields
              value={entry.administration}
              onChange={entry.setAdministration}
              disabled={saving.saving}
            />
          ) : null}
          {!completed ? <Text style={styles.muted}>Save an incomplete draft, or review this dose before completing the record. A draft does not mark the dose as administered.</Text> : null}
          <View style={styles.row}>
            {!completed ? <Button label="Save Draft" variant="secondary" loading={saving.saving} onPress={entry.saveDraft} /> : null}
            <Button label={completed ? "Review selected dose" : "Complete Record"} disabled={saving.saving} onPress={entry.review} />
          </View>
        </View>
      )}
      {saving.error ? (
        <View style={styles.section}>
          <Text accessibilityRole="alert" style={styles.error}>
            {saving.error} No saved update is shown. Reload to confirm the
            current record before retrying.
          </Text>
          <Button
            label="Reload saved checklist"
            variant="secondary"
            disabled={saving.saving}
            onPress={() => transition(() => void entry.finish())}
          />
        </View>
      ) : null}
      <Button
        label="Close dose entry"
        variant="text"
        disabled={saving.saving}
        onPress={embedded ? onRequestClose : () => transition(onRequestClose)}
      />
    </View>
  );
  if (embedded) return body;
  return (
    <CompleteModalShell
      visible
      onRequestClose={() => transition(onClose)}
      dismissible={!saving.saving}
      title={completed ? "Correct or void administration" : "Record one dose"}
      scrollToTopKey={reviewing ? 1 : 0}
    >
      {body}
    </CompleteModalShell>
  );
};
export default DoseForm;
