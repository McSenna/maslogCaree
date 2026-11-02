import { View } from "react-native";
import type { Administration } from "../types";
import ClinicalField from "./ClinicalField";
import ClinicalToggle from "./ClinicalToggle";
import useImmunizationStyles from "./immunizationStyles";

const OPTIONAL_FIELDS = [
  ["administeredAt", "Administration time (HH:mm, optional)"],
  ["administeredBy", "Clinician who administered the dose (optional)"],
  ["facility", "Facility (optional)"],
  ["lotNumber", "Lot number (optional)"],
  ["route", "Route (optional)"],
  ["site", "Site (optional)"],
  ["remarks", "Remarks (optional)"],
] as const;
const ClinicalDetailsFields = ({
  value,
  onChange,
  disabled,
}: {
  value: Administration;
  onChange: (next: Administration) => void;
  disabled: boolean;
}) => {
  const { styles } = useImmunizationStyles();
  return (
    <View style={styles.section}>
      <ClinicalField
        label="Actual administration date"
        value={value.administeredOn}
        onChange={(administeredOn) => onChange({ ...value, administeredOn })}
        date
        past
        required
        disabled={disabled}
      />
      {OPTIONAL_FIELDS.map(([key, label]) => (
        <ClinicalField
          key={key}
          label={label}
          value={value[key] ?? ""}
          onChange={(text) => onChange({ ...value, [key]: text })}
          disabled={disabled}
        />
      ))}
      <ClinicalToggle
        label="Historical administration copied from an earlier record"
        value={value.historical ?? false}
        onChange={(historical) => onChange({ ...value, historical })}
        disabled={disabled}
      />
    </View>
  );
};
export default ClinicalDetailsFields;
