import { View } from "react-native";

import FormRow from "@/features/auth/registration/components/FormRow";
import RegistrationInput from "@/features/auth/registration/components/RegistrationInput";
import StepHeading from "@/features/auth/registration/components/StepHeading";

import { MASTER_STEPS } from "../../masterResidentSteps";
import type { EditorStepProps } from "./editorLayout";

const STEP = MASTER_STEPS[2];

const MasterAddressStep = ({ form, inputHeight, twoColumn }: EditorStepProps) => {
  const { values, errors, setField, submitting, isEditing } = form;

  return (
    <View style={{ gap: 18 }}>
      <StepHeading title={STEP.title} subtitle={STEP.subtitle} />
      <RegistrationInput
        label="Purok and Street"
        required
        icon="home"
        value={values.address}
        onChangeText={(text) => setField("address", text)}
        placeholder="e.g. Purok 3, Sampaguita Street"
        error={errors.address}
        disabled={submitting}
        height={inputHeight}
        autoCapitalize="words"
        maxLength={255}
      />
      <FormRow twoColumn={twoColumn}>
        <RegistrationInput
          label="Barangay"
          required
          icon="map-pin"
          value={values.barangay}
          onChangeText={(text) => setField("barangay", text)}
          error={errors.barangay}
          disabled={submitting}
          height={inputHeight}
          autoCapitalize="words"
          maxLength={100}
        />
        <RegistrationInput
          label="Master Resident ID"
          optional={!isEditing}
          icon="hash"
          value={values.masterResidentId ?? ""}
          onChangeText={(text) => setField("masterResidentId", text)}
          placeholder="Leave blank to generate one"
          error={errors.masterResidentId}
          disabled={submitting || isEditing}
          helper={isEditing ? "Record IDs never change." : "Use the registry's own ID when there is one."}
          height={inputHeight}
          autoCapitalize="characters"
          maxLength={40}
        />
      </FormRow>
    </View>
  );
};

export default MasterAddressStep;
