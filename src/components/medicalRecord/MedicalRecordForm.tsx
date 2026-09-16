import { useCallback, useMemo } from "react";
import { View } from "react-native";

import type { CompletionForm, MedicalField } from "@/services/medicalRecords";

import MedicalFieldInput, { type FieldValue } from "./MedicalFieldInput";
import FieldGroup from "./complete/FieldGroup";
import { groupFields } from "./form/groupFields";
import type { FormValues } from "./form/formValues";

export type { FormValues } from "./form/formValues";
export { emptyValues, toMedicalRecordInput, validateValues } from "./form/formValues";
export { useMedicalRecordForm } from "./form/useMedicalRecordForm";

const MedicalRecordForm = ({
  form,
  values,
  errors,
  onChange,
  disabled,
  twoColumn = false,
  fieldOverrides,
}: {
  form: CompletionForm;
  values: FormValues;
  errors: Record<string, string>;
  onChange: (key: string, value: FieldValue) => void;
  disabled?: boolean;
  twoColumn?: boolean;
  fieldOverrides?: Record<string, (field: MedicalField) => React.ReactNode>;
}) => {
  const followUpOn = values.followUpRequired === true;

  const visibleFollowUp = useMemo(
    () => form.followUp.filter((field) => !(field.key === "followUpDate" && !followUpOn)),
    [form.followUp, followUpOn]
  );

  const serviceGroups = useMemo(() => groupFields(form.service), [form.service]);

  const render = useCallback(
    (field: MedicalField) => {
      const override = fieldOverrides?.[field.key];
      if (override) return override(field);
      return (
        <MedicalFieldInput
          key={field.key}
          field={field}
          value={values[field.key]}
          error={errors[field.key]}
          onChange={(next) => onChange(field.key, next)}
          disabled={disabled}
        />
      );
    },
    [values, errors, onChange, disabled, fieldOverrides]
  );

  return (
    <View className="w-full gap-5">
      {serviceGroups.map((group, index) => (
        <FieldGroup
          key={group.title ?? `ungrouped-${index}`}
          title={group.title}
          fields={group.fields}
          twoColumn={twoColumn}
          renderField={render}
        />
      ))}

      <FieldGroup
        title="Clinical assessment"
        fields={form.common}
        twoColumn={twoColumn}
        renderField={render}
      />

      <FieldGroup
        title="Follow-up"
        fields={visibleFollowUp}
        twoColumn={twoColumn}
        renderField={render}
      />
    </View>
  );
};

export default MedicalRecordForm;
