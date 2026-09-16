import { Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import type { useEditProfile } from "../../hooks/useEditProfile";
import ProfileFieldInput from "../../components/profileForm/ProfileField";

type EditProfileFieldsProps = {
  edit: ReturnType<typeof useEditProfile>;
};

const EditProfileFields = ({ edit }: EditProfileFieldsProps) => {
  const { values, errors, setField } = edit.editForm;

  return (
    <View style={{ gap: 14 }}>
      <ProfileFieldInput
        label="Full Name"
        value={values.fullname}
        onChangeText={(text) => setField("fullname", text)}
        autoCapitalize="words"
        error={errors.fullname}
      />

      <ProfileFieldInput
        label="Contact Number"
        value={values.phone}
        onChangeText={(text) => setField("phone", text)}
        keyboardType="phone-pad"
        error={errors.phone}
      />

      <ProfileFieldInput
        label="Address"
        value={values.address}
        onChangeText={(text) => setField("address", text)}
        autoCapitalize="sentences"
        multiline
        error={errors.address}
      />

      <ProfileFieldInput label="Email Address" value={values.email} editable={false} />

      <Text style={{ fontSize: 12, lineHeight: 17, color: SOCIAL_COLORS.subtle }}>
        Your email address, date of birth and gender are managed by your barangay health
        office. Contact them if any of these details need to be corrected.
      </Text>
    </View>
  );
};

export default EditProfileFields;
