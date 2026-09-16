import { View } from "react-native";

import AvatarPicker from "../components/AvatarPicker";
import FormRow from "../components/FormRow";
import StepHeading from "../components/StepHeading";
import { STEP_SUBTITLES } from "../registrationOptions";
import { useIdentityContactFields } from "./personal/useIdentityContactFields";
import { useNameFields } from "./personal/useNameFields";
import type { StepProps } from "./stepLayout";

const PersonalStep = (props: StepProps) => {
  const { form, layout } = props;
  const { twoColumn } = layout;
  const name = useNameFields(props);
  const identity = useIdentityContactFields(props);

  return (
    <View style={{ gap: 18 }}>
      <StepHeading title="Personal Information" subtitle={STEP_SUBTITLES.personal} />

      <AvatarPicker photo={form.photo.photo} onPress={form.photo.choosePhoto} />

      {twoColumn ? (
        <>
          <FormRow twoColumn>
            {name.firstName}
            {name.middleName}
          </FormRow>
          <FormRow twoColumn>
            {name.surname}
            {name.suffix}
          </FormRow>
          <FormRow twoColumn>
            {identity.dateOfBirth}
            {identity.sex}
          </FormRow>
          <FormRow twoColumn>
            {identity.civilStatus}
            {identity.contactNumber}
          </FormRow>
          {identity.email}
        </>
      ) : (
        <View style={{ gap: 18 }}>
          {name.firstName}
          {name.middleName}
          {name.surname}
          {name.suffix}
          {identity.dateOfBirth}
          {identity.sex}
          {identity.civilStatus}
          {identity.contactNumber}
          {identity.email}
        </View>
      )}
    </View>
  );
};

export default PersonalStep;
