import { View } from "react-native";
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
    <View style={{ gap: 14 }}>
      <ProfileFieldInput
        label="Contact Number"
        value={values.phone}
        onChangeText={(text) => setField("phone", text)}
        keyboardType="phone-pad"
        error={errors.phone}
      />

      <ReadOnlyField label="Email Address" hint="Managed by your health office" value={email} />

      <ProfileFieldInput
        label="Address"
        value={values.address}
        onChangeText={(text) => setField("address", text)}
        autoCapitalize="sentences"
        multiline
        error={errors.address}
      />
    </View>
  );
};

export default ContactInfoForm;
