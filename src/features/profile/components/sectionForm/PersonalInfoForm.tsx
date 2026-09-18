import { View } from "react-native";
import type { EditProfileFormState } from "../../hooks/useEditProfileForm";
import { calculateAge } from "../../utils/profileHelpers";
import DateOfBirthField from "../profileForm/DateOfBirthField";
import GenderField from "../profileForm/GenderField";
import ProfileFieldInput from "../profileForm/ProfileField";
import ReadOnlyField from "../profileForm/ReadOnlyField";

type PersonalInfoFormProps = {
  form: EditProfileFormState;
};

const PersonalInfoForm = ({ form }: PersonalInfoFormProps) => {
  const { values, errors, setField } = form;
  const age = calculateAge(values.dateOfBirth || null);

  return (
    <View style={{ gap: 14 }}>
      <ProfileFieldInput
        label="First Name"
        value={values.firstName}
        onChangeText={(text) => setField("firstName", text)}
        autoCapitalize="words"
        error={errors.firstName}
      />

      <ProfileFieldInput
        label="Middle Name"
        hint="Optional"
        value={values.middleName}
        onChangeText={(text) => setField("middleName", text)}
        autoCapitalize="words"
        error={errors.middleName}
      />

      <ProfileFieldInput
        label="Last Name"
        value={values.surname}
        onChangeText={(text) => setField("surname", text)}
        autoCapitalize="words"
        error={errors.surname}
      />

      <DateOfBirthField
        label="Date of Birth"
        value={values.dateOfBirth}
        onChange={(isoDate) => setField("dateOfBirth", isoDate)}
        error={errors.dateOfBirth}
      />

      <ReadOnlyField
        label="Age"
        hint="From date of birth"
        value={age === null ? "—" : `${age} years old`}
      />

      <GenderField
        label="Gender"
        value={values.gender}
        onChange={(gender) => setField("gender", gender)}
        error={errors.gender}
      />
    </View>
  );
};

export default PersonalInfoForm;
