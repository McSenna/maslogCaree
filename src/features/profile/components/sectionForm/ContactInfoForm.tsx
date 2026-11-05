import { View } from "react-native";
import { SPACING } from "@/theme/spacing";
import type { EditProfileFormState } from "../../hooks/useEditProfileForm";
import ProfileFieldInput from "../profileForm/ProfileField";
import ReadOnlyField from "../profileForm/ReadOnlyField";

type ContactInfoFormProps = {
  form: EditProfileFormState;
  email: string;
};

const ContactInfoForm = ({ form, email }: ContactInfoFormProps) => {
  const { values, errors, setField } = form;

  return (
    <View style={{ gap: SPACING.lg }}>
      <ReadOnlyField label="Email address" hint="Managed by your health office" value={email} />

      <ProfileFieldInput
        label="Phone number"
        value={values.phone}
        onChangeText={(text) => setField("phone", text)}
        keyboardType="phone-pad"
        error={errors.phone}
      />
    </View>
  );
};

export default ContactInfoForm;
