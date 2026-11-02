import { todayKey } from "../immunizationLogic";
import DateField from "@/components/medicalRecord/fields/DateField";
import TextField from "@/components/medicalRecord/fields/TextField";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalField } from "@/services/medicalRecordTypes";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  date?: boolean;
  past?: boolean;
  future?: boolean;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
};
const ClinicalField = ({
  label,
  value,
  onChange,
  date,
  past,
  future,
  required,
  disabled,
  multiline,
}: Props) => {
  const palette = useQueuePalette();
  const field: MedicalField = {
    key: label,
    label,
    required,
    type: "text",
    maxLength: 500,
  };
  if (date) {
    field.type = "date";
    if (past) field.when = "past";
    if (future) field.when = "after_visit";
  }
  if (multiline) field.type = "textarea";
  const Control = date ? DateField : TextField;
  return (
    <Control
      field={field}
      value={value}
      onChange={(next) => onChange(typeof next === "string" ? next : "")}
      palette={palette}
      boundsOverride={
        date
          ? { min: future ? todayKey() : null, max: past ? todayKey() : null }
          : undefined
      }
      disabled={disabled}
    />
  );
};
export default ClinicalField;
