import { Text, View } from "react-native";
import { SectionCard } from "@/components/medicalRecord/complete/SectionCard";
import ReadOnlyField from "@/components/medicalRecord/fields/ReadOnlyField";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { doseIdentity, type DoseEntryErrors } from "../immunizationLogic";
import type { Administration, DoseRecord } from "../types";
import ClinicalField from "./ClinicalField";
import ClinicalToggle from "./ClinicalToggle";
import useImmunizationStyles from "./immunizationStyles";

const REACTION_FIELDS = [
  ["immediateReaction", "Immediate reaction (optional)"],
  ["aefi", "Adverse event following immunization, AEFI (optional)"],
] as const;
const REACTION_MAX_LENGTH = 2000;

type Props = {
  value: Administration;
  onChange: (next: Administration) => void;
  errors: DoseEntryErrors;
  disabled: boolean;
};

export const AdministrationDateFields = ({ value, onChange, errors, disabled }: Props) => {
  const { styles } = useImmunizationStyles();
  return (
    <View style={styles.detailFields}>
      <View style={styles.detailField}>
        <ClinicalField label="Actual administration date" value={value.administeredOn} onChange={(administeredOn) => onChange({ ...value, administeredOn })} date past required disabled={disabled} error={errors.administeredOn} />
      </View>
      <View style={styles.detailField}>
        <ClinicalField label="Administration time (optional)" value={value.administeredAt ?? ""} onChange={(administeredAt) => onChange({ ...value, administeredAt })} time disabled={disabled} error={errors.administeredAt} />
      </View>
    </View>
  );
};

type DetailsProps = Props & {
  /** The signed-in midwife's name, blank when the account cannot be confirmed. */
  signedInName: string;
  saved: DoseRecord | null;
};

const HISTORICAL_FIELDS = [
  { key: "administeredBy", label: "Clinician who administered the dose", required: true },
  { key: "facility", label: "Facility on the earlier record (optional)", required: false },
] as const;

/** The server sets clinician and location, so they only show here, unless the dose was given elsewhere. */
export const AdministrationDetailsSection = ({ value, onChange, errors, disabled, signedInName, saved }: DetailsProps) => {
  const { styles } = useImmunizationStyles();
  const palette = useQueuePalette();
  const identity = doseIdentity(saved, signedInName);
  return (
    <SectionCard icon="clipboard" title="Administration Details">
      <View style={styles.section}>
        <View style={styles.detailFields}>
          {value.historical ? (
            HISTORICAL_FIELDS.map(({ key, label, required }) => (
              <View key={key} style={styles.detailField}>
                <ClinicalField label={label} value={value[key] ?? ""} onChange={(text) => onChange({ ...value, [key]: text })} required={required} disabled={disabled} error={key === "administeredBy" ? errors.administeredBy : undefined} />
              </View>
            ))
          ) : (
            <>
              <View style={styles.detailField}>
                <ReadOnlyField
                  label="Clinician"
                  value={identity.clinician || (identity.keepsSaved ? "Not recorded" : "Not available")}
                  helper={identity.keepsSaved ? "Who gave this dose. A correction does not change it." : "Automatically assigned from logged-in midwife"}
                  palette={palette}
                />
              </View>
              <View style={styles.detailField}>
                <ReadOnlyField
                  label="Location"
                  value={identity.location || "Not recorded"}
                  helper={identity.keepsSaved ? "Where this dose was recorded" : "Assigned healthcare facility"}
                  palette={palette}
                />
              </View>
            </>
          )}
        </View>
        {identity.keepsSaved ? <Text style={styles.muted}>Correction recorded by {signedInName || "your signed-in account"}. The original values stay in the audit history.</Text> : null}
        <ClinicalToggle label="Historical administration copied from an earlier record" value={value.historical ?? false} onChange={(historical) => onChange({ ...value, historical })} disabled={disabled} />
        {value.historical ? <Text style={styles.muted}>This dose was given elsewhere, so enter what the earlier record says. It is flagged for review, and your account is recorded as the one who copied it.</Text> : null}
      </View>
    </SectionCard>
  );
};

export const AdditionalInformationSection = ({ value, onChange, disabled }: Omit<Props, "errors">) => {
  const { styles } = useImmunizationStyles();
  return (
    <SectionCard icon="file-text" title="Additional Information">
      <View style={styles.section}>
        <ClinicalField label="Remarks (optional)" value={value.remarks ?? ""} onChange={(remarks) => onChange({ ...value, remarks })} disabled={disabled} multiline maxLength={REACTION_MAX_LENGTH} />
        {REACTION_FIELDS.map(([key, label]) => (
          <ClinicalField key={key} label={label} value={value[key] ?? ""} onChange={(text) => onChange({ ...value, [key]: text })} disabled={disabled} multiline maxLength={REACTION_MAX_LENGTH} />
        ))}
        <Text style={styles.muted}>A blank reaction field is saved as Not recorded. It does not mean no reaction occurred.</Text>
      </View>
    </SectionCard>
  );
};
