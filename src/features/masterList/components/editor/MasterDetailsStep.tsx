import { View } from "react-native";

import DateInput from "@/features/auth/registration/components/DateInput";
import FormRow from "@/features/auth/registration/components/FormRow";
import SegmentedInput from "@/features/auth/registration/components/SegmentedInput";
import SelectInput from "@/features/auth/registration/components/SelectInput";
import StepHeading from "@/features/auth/registration/components/StepHeading";

import { CIVIL_STATUS_CHOICES, SEX_CHOICES } from "../../masterResidentForm";
import { MASTER_STEPS } from "../../masterResidentSteps";
import type { EditorStepProps } from "./editorLayout";

const STEP = MASTER_STEPS[1];

// Nothing here is preselected: a guessed sex, birth date or civil status on an
// official record is worse than an empty field the admin must fill.
const MasterDetailsStep = ({ form, inputHeight, twoColumn }: EditorStepProps) => {
  const { values, errors, setField } = form;

  return (
    <View style={{ gap: 18 }}>
      <StepHeading title={STEP.title} subtitle={STEP.subtitle} />
      <FormRow twoColumn={twoColumn}>
        <DateInput
          label="Date of Birth"
          required
          value={values.dateOfBirth}
          onChange={(date) => setField("dateOfBirth", date)}
          placeholder="Select the birth date"
          error={errors.dateOfBirth}
          height={inputHeight}
        />
        <SegmentedInput
          label="Sex"
          required
          value={values.sex}
          options={SEX_CHOICES}
          onChange={(value) => setField("sex", value)}
          error={errors.sex}
          height={inputHeight}
        />
      </FormRow>
      <SelectInput
        label="Civil Status"
        required
        icon="users"
        value={values.civilStatus}
        options={CIVIL_STATUS_CHOICES}
        onChange={(value) => setField("civilStatus", value)}
        placeholder="Select civil status"
        error={errors.civilStatus}
        height={inputHeight}
      />
    </View>
  );
};

export default MasterDetailsStep;
