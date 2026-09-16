import { View } from "react-native";

import RegistrationInput from "../components/RegistrationInput";
import SelectInput from "../components/SelectInput";
import StepHeading from "../components/StepHeading";
import { STEP_SUBTITLES } from "../registrationOptions";
import IdDocumentField from "./identity/IdDocumentField";
import { useIdTypeOptions } from "./identity/useIdTypeOptions";
import type { StepProps } from "./stepLayout";

const IdentityStep = ({ form, layout }: StepProps) => {
  const { values, errors, setField, blurField } = form;
  const { inputHeight } = layout;
  const { idTypeOptions, loadingConfig } = useIdTypeOptions();

  const selectedIdType = idTypeOptions.find((option) => option.value === values.idType);
  const placeholderForId = selectedIdType
    ? `Enter your ${selectedIdType.label} number`
    : "Enter identification number shown on ID";

  return (
    <View style={{ gap: 20 }}>
      <StepHeading title="Government ID Verification" subtitle={STEP_SUBTITLES.identity} />

      <SelectInput
        label="ID Type"
        required
        icon="credit-card"
        value={values.idType}
        options={idTypeOptions}
        onChange={(val) => {
          setField("idType", val);
          blurField("idType");
        }}
        placeholder={loadingConfig ? "Loading accepted ID types..." : "Select valid Government ID"}
        error={errors.idType}
        height={inputHeight}
        helper="Ensure the ID is valid and currently unexpired."
      />

      <RegistrationInput
        label="ID Number"
        required
        icon="hash"
        value={values.idNumber}
        onChangeText={(text) => setField("idNumber", text)}
        onBlur={() => blurField("idNumber")}
        placeholder={placeholderForId}
        error={errors.idNumber}
        height={inputHeight}
        helper="Enter the complete ID number exactly as printed on the document."
        autoCapitalize="characters"
      />

      <IdDocumentField form={form} />
    </View>
  );
};

export default IdentityStep;
