import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalField } from "@/services/medicalRecords";

import BooleanField from "./fields/BooleanField";
import DateField from "./fields/DateField";
import SelectField from "./fields/SelectField";
import TextField from "./fields/TextField";
import type { FieldValue } from "./fields/fieldShell";

export type { FieldValue } from "./fields/fieldShell";
export { toDateKey } from "./fields/fieldShell";

const FIELD_COMPONENTS = {
  boolean: BooleanField,
  select: SelectField,
  date: DateField,
} as const;

const MedicalFieldInput = ({
  field,
  value,
  onChange,
  error,
  disabled,
}: {
  field: MedicalField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  error?: string;
  disabled?: boolean;
}) => {
  const palette = useQueuePalette();

  const Component =
    FIELD_COMPONENTS[field.type as keyof typeof FIELD_COMPONENTS] ?? TextField;

  return (
    <Component
      field={field}
      value={value}
      onChange={onChange}
      palette={palette}
      helper={error ?? field.helper}
      error={error}
      disabled={disabled}
    />
  );
};

export default MedicalFieldInput;
