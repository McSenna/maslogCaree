import { ScrollView, View, useWindowDimensions } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS, PROFILE_SHADOW } from "../../config/profileTheme";
import type { useEditProfile } from "../../hooks/useEditProfile";
import type { ProfileData } from "../../utils/profileData";
import ProfileOverlay from "../../components/ProfileOverlay";
import EditProfileForm from "./EditProfileForm";
import EditProfileHeader from "./EditProfileHeader";

type EditProfileModalProps = {
  visible: boolean;
  profile: ProfileData;
  edit: ReturnType<typeof useEditProfile>;
};

const MODAL_MAX_WIDTH = 560;

const EditProfileModal = ({ visible, profile, edit }: EditProfileModalProps) => {
  const { width, height } = useWindowDimensions();

  return (
    <ProfileOverlay
      visible={visible}
      onClose={edit.requestCloseEditProfile}
      accessibilityLabel="Edit profile"
    >
      <View
        style={{
          width: Math.min(MODAL_MAX_WIDTH, width - 40),
          maxHeight: Math.round(height * 0.88),
          borderRadius: PROFILE_RADIUS.modal,
          backgroundColor: SOCIAL_COLORS.surface,
          overflow: "hidden",
          ...PROFILE_SHADOW.modal,
        }}
      >
        <EditProfileHeader onClose={edit.requestCloseEditProfile} />

        <ScrollView
          style={{ flexShrink: 1 }}
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <EditProfileForm profile={profile} edit={edit} />
        </ScrollView>
      </View>
    </ProfileOverlay>
  );
};

export default EditProfileModal;
