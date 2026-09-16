import VaccineField from "../VaccineField";
import type { useVaccineLink } from "../useVaccineLink";
import type { FormValues } from "../../MedicalRecordForm";

export const buildVaccineFieldOverride = ({
  vaccine,
  values,
  errors,
  saving,
}: {
  vaccine: ReturnType<typeof useVaccineLink>;
  values: FormValues;
  errors: Record<string, string>;
  saving: boolean;
}) => {
  const inventoryField = vaccine.field;
  if (!inventoryField) return undefined;

  return {
    [inventoryField.key]: () => (
      <VaccineField
        key={inventoryField.key}
        field={inventoryField}
        value={
          typeof values[inventoryField.key] === "string" ? String(values[inventoryField.key]) : ""
        }
        error={errors[inventoryField.key]}
        disabled={saving}
        linkedItem={vaccine.linkedItem}
        onPick={vaccine.pick}
        onClear={vaccine.unlink}
      />
    ),
  };
};
