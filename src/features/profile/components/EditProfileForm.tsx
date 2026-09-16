import { useState } from "react";
import { View } from "react-native";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";
import AvatarSection from "./profileForm/AvatarSection";
import FormActions from "./profileForm/FormActions";
import ProfileField from "./profileForm/ProfileField";

export type EditProfileValues = {
  fullname: string;
  nickname?: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
  avatarUrl?: string | null;
};

type EditProfileFormProps = {
  initialValues: EditProfileValues;
  onDiscard?: () => void;
  onSave?: (values: EditProfileValues) => Promise<void> | void;
};

const EditProfileForm = ({ initialValues, onDiscard, onSave }: EditProfileFormProps) => {
  const [values, setValues] = useState<EditProfileValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof EditProfileValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarPress = () => {
    showAlert(
      "Change Profile Photo",
      "Profile photo upload is not yet connected. Integrate image picker / upload here."
    );
  };

  const handleSave = async () => {
    if (!onSave) return;

    if (!values.fullname.trim()) {
      showAlert("Full Name Required", "Please enter your full name.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(values);
    } catch (error: unknown) {
      showAlert(
        "Save Failed",
        getApiErrorMessage(error, "Unable to save your profile right now. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-5">
      <AvatarSection imageUrl={values.avatarUrl ?? null} onPress={handleAvatarPress} />

      <View className="gap-4">
        <ProfileField
          label="Full Name"
          value={values.fullname}
          onChangeText={(t) => handleChange("fullname", t)}
          autoCapitalize="words"
        />
        <ProfileField
          label="Nickname"
          value={values.nickname ?? ""}
          onChangeText={(t) => handleChange("nickname", t)}
          autoCapitalize="words"
        />
        <ProfileField label="Email" value={values.email} editable={false} keyboardType="email-address" />
        <ProfileField
          label="Phone"
          value={values.phone ?? ""}
          onChangeText={(t) => handleChange("phone", t)}
          keyboardType="phone-pad"
        />
        <ProfileField
          label="Address"
          value={values.address ?? ""}
          onChangeText={(t) => handleChange("address", t)}
          multiline
        />
        <ProfileField
          label="Occupation"
          value={values.occupation ?? ""}
          onChangeText={(t) => handleChange("occupation", t)}
        />
      </View>

      <FormActions isSubmitting={isSubmitting} onDiscard={onDiscard} onSave={() => void handleSave()} />
    </View>
  );
};

export default EditProfileForm;
