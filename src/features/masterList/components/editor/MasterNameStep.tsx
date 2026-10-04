import { View } from "react-native";

import FormRow from "@/features/auth/registration/components/FormRow";
import RegistrationInput from "@/features/auth/registration/components/RegistrationInput";
import StepHeading from "@/features/auth/registration/components/StepHeading";

import { MASTER_STEPS } from "../../masterResidentSteps";
import type { EditorStepProps } from "./editorLayout";

const STEP = MASTER_STEPS[0];

const MasterNameStep = ({ form, inputHeight, twoColumn }: EditorStepProps) => {
  const { values, errors, setField, submitting } = form;

  return (
    <View style={{ gap: 18 }}>
      <StepHeading title={STEP.title} subtitle={STEP.subtitle} />
      <FormRow twoColumn={twoColumn}>
        <RegistrationInput
          label="First Name"
          required
          icon="user"
          value={values.firstName}
          onChangeText={(text) => setField("firstName", text)}
          placeholder="As written in the registry"
          error={errors.firstName}
          disabled={submitting}
          height={inputHeight}
          autoCapitalize="words"
          maxLength={50}
        />
        <RegistrationInput
          label="Middle Name"
          optional
          icon="user"
          value={values.middleName}
          onChangeText={(text) => setField("middleName", text)}
          placeholder="Leave blank if none"
          error={errors.middleName}
          disabled={submitting}
          height={inputHeight}
          autoCapitalize="words"
          maxLength={50}
        />
      </FormRow>
      <FormRow twoColumn={twoColumn}>
        <RegistrationInput
          label="Last Name"
          required
          icon="user"
          value={values.lastName}
          onChangeText={(text) => setField("lastName", text)}
          placeholder="As written in the registry"
          error={errors.lastName}
          disabled={submitting}
          height={inputHeight}
          autoCapitalize="words"
          maxLength={50}
        />
        <RegistrationInput
          label="Suffix"
          optional
          icon="award"
          value={values.suffix}
          onChangeText={(text) => setField("suffix", text)}
          placeholder="e.g. Jr. or III"
          error={errors.suffix}
          disabled={submitting}
          height={inputHeight}
          maxLength={20}
        />
      </FormRow>
    </View>
  );
};

export default MasterNameStep;
