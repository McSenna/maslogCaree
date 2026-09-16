import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import type { useEditProfile } from "../../hooks/useEditProfile";
import type { ProfileData } from "../../utils/profileData";
import EditProfileForm from "./EditProfileForm";
import EditProfileHeader from "./EditProfileHeader";

type EditProfileBottomSheetProps = {
  visible: boolean;
  profile: ProfileData;
  edit: ReturnType<typeof useEditProfile>;
};

const EditProfileBottomSheet = ({
  visible,
  profile,
  edit,
}: EditProfileBottomSheetProps) => (
  <BottomSheet
    visible={visible}
    onClose={edit.requestCloseEditProfile}
    accessibilityLabel="Edit profile"
    surface={SOCIAL_COLORS.surface}
    handleColor={SOCIAL_COLORS.border}
    header={(requestClose) => <EditProfileHeader onClose={requestClose} compact />}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <EditProfileForm profile={profile} edit={edit} />
      </ScrollView>
    </KeyboardAvoidingView>
  </BottomSheet>
);

export default EditProfileBottomSheet;
