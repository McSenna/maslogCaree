import { Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import type { useEditProfile } from "../../hooks/useEditProfile";
import type { ProfileData } from "../../utils/profileData";
import FormActions from "../../components/profileForm/FormActions";
import ProfilePhoto from "../../components/ProfilePhoto";
import EditProfileFields from "./EditProfileFields";

type EditProfileFormProps = {
  profile: ProfileData;
  edit: ReturnType<typeof useEditProfile>;
};

const EditProfileForm = ({ profile, edit }: EditProfileFormProps) => (
  <View style={{ gap: 18 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
      <ProfilePhoto
        size={72}
        imageUrl={profile.avatarUrl}
        initials={profile.initials}
        name={profile.name}
        onChangePhoto={edit.changeAvatar}
        changingPhoto={edit.savingAvatar}
      />

      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <Text style={{ fontSize: 14.5, fontWeight: "700", color: SOCIAL_COLORS.navy }}>
          Profile Photo
        </Text>
        <Text style={{ fontSize: 12.5, lineHeight: 17, color: SOCIAL_COLORS.muted }}>
          Tap the camera icon to upload a new photo. It is saved as soon as you pick it.
        </Text>
      </View>
    </View>

    <EditProfileFields edit={edit} />

    <FormActions
      isSubmitting={edit.editSaving}
      canSave={edit.editForm.isDirty}
      onDiscard={edit.requestCloseEditProfile}
      onSave={() => void edit.saveEditProfile()}
    />
  </View>
);

export default EditProfileForm;
