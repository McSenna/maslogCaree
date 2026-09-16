import { View } from "react-native";
import type { ProfileFieldKey } from "../config/profileRoleConfig";
import type { useEditProfile } from "../hooks/useEditProfile";
import type { EditProfileValues } from "../hooks/useEditProfileForm";
import type { ProfileField as ProfileFieldData } from "../utils/profileData";
import FormActions from "./profileForm/FormActions";
import ProfileFieldInput from "./profileForm/ProfileField";
import ProfileInfoRow from "./ProfileInfoRow";

type PersonalInfoEditFieldsProps = {
  fields: ProfileFieldData[];
  edit: ReturnType<typeof useEditProfile>;
};

const EDITABLE_KEYS: Partial<Record<ProfileFieldKey, keyof EditProfileValues>> = {
  fullName: "fullname",
  phone: "phone",
  address: "address",
};

const PersonalInfoEditFields = ({ fields, edit }: PersonalInfoEditFieldsProps) => {
  const { values, errors, setField } = edit.editForm;

  return (
    <View className="gap-4 py-1">
      {fields.map((field) => {
        const editKey = EDITABLE_KEYS[field.key];

        if (!editKey) {
          return (
            <ProfileInfoRow
              key={field.key}
              label={field.label}
              value={field.value}
              icon={field.icon}
              provided={field.provided}
              showDivider={false}
            />
          );
        }

        return (
          <ProfileFieldInput
            key={field.key}
            label={field.label}
            value={values[editKey]}
            onChangeText={(text) => setField(editKey, text)}
            keyboardType={editKey === "phone" ? "phone-pad" : "default"}
            autoCapitalize={editKey === "fullname" ? "words" : "none"}
            multiline={editKey === "address"}
            error={errors[editKey as keyof typeof errors]}
          />
        );
      })}

      <FormActions
        isSubmitting={edit.editSaving}
        canSave={edit.editForm.isDirty}
        onDiscard={edit.requestCloseEditProfile}
        onSave={() => void edit.saveEditProfile()}
      />
    </View>
  );
};

export default PersonalInfoEditFields;
