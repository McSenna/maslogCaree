import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import { SectionCard } from "@/components/medicalRecord/complete/SectionCard";
import type useDoseEntry from "../hooks/useDoseEntry";
import type useFollowUpEntry from "../hooks/useFollowUpEntry";
import type { Checklist, DoseView } from "../types";
import { AdditionalInformationSection, AdministrationDateFields, AdministrationDetailsSection } from "./ClinicalDetailsFields";
import ClinicalField from "./ClinicalField";
import { DoseFacts, DoseSchedule } from "./DoseIdentity";
import DoseReview from "./DoseReview";
import FollowUpForm from "./FollowUpForm";
import useImmunizationStyles from "./immunizationStyles";

export type DoseFormSection = "correction" | "vaccination" | "administration";

type Props = {
  checklist: Checklist;
  dose: DoseView;
  entry: ReturnType<typeof useDoseEntry>;
  followUp: ReturnType<typeof useFollowUpEntry>;
  signedInName: string;
  /** Where each section sits, so a failed save can scroll to the first field to fix. */
  onSectionLayout: (section: DoseFormSection, y: number) => void;
};

/** The modal's body while entering a dose. Its actions live in the pinned footer. */
const DoseForm = ({ checklist, dose, entry, followUp, signedInName, onSectionLayout }: Props) => {
  const { styles } = useImmunizationStyles();
  const { completed, mode, setMode, reviewing, saving, action, setAction, administration, setAdministration, errors } = entry;
  const disabled = saving.saving;
  const fields = { value: administration, onChange: setAdministration, disabled };

  if (reviewing) return <DoseReview entry={entry} saved={dose.record} signedInName={signedInName} />;

  return (
    <View style={styles.section}>
      {completed ? (
        <View onLayout={(event) => onSectionLayout("correction", event.nativeEvent.layout.y)}>
          <SectionCard icon="edit-2" title="Change saved record">
            <View style={styles.row}>
              <Button label="Correct record" variant={action === "correct" ? "primary" : "secondary"} onPress={() => setAction("correct")} />
              <Button label="Void record" variant={action === "void" ? "primary" : "secondary"} onPress={() => setAction("void")} />
            </View>
            <ClinicalField label="Reason for correction or void" value={entry.reason} onChange={entry.setReason} required multiline disabled={disabled} error={errors.reason} />
          </SectionCard>
        </View>
      ) : (
        <View style={styles.row}>
          <Button label="Record administration" variant={mode === "administration" ? "primary" : "secondary"} onPress={() => setMode("administration")} disabled={disabled} />
          <Button label="Plan follow-up" variant={mode === "follow-up" ? "primary" : "secondary"} onPress={() => setMode("follow-up")} disabled={disabled} />
        </View>
      )}
      <View onLayout={(event) => onSectionLayout("vaccination", event.nativeEvent.layout.y)}>
        <SectionCard icon="shield" title="Vaccination Information">
          <DoseFacts checklist={checklist} dose={dose} />
          {mode === "administration" && action !== "void" ? <AdministrationDateFields {...fields} errors={errors} /> : null}
          <DoseSchedule dose={dose} />
        </SectionCard>
      </View>
      {mode === "follow-up" && !completed ? <FollowUpForm entry={followUp} disabled={disabled} /> : null}
      {mode === "administration" && action !== "void" ? (
        <>
          <View onLayout={(event) => onSectionLayout("administration", event.nativeEvent.layout.y)}>
            <AdministrationDetailsSection {...fields} errors={errors} signedInName={signedInName} saved={dose.record} />
          </View>
          <AdditionalInformationSection {...fields} />
        </>
      ) : null}
      <Text style={styles.muted}>
        {completed
          ? "Corrections and voids require a reason and retain the original audit history."
          : "A draft does not mark the dose as administered."}
      </Text>
    </View>
  );
};
export default DoseForm;
