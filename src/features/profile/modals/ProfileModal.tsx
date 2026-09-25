import { ScrollView, View } from "react-native";

import { useModalFrame } from "@/hooks/useModalFrame";
import { useResponsive } from "@/hooks/useResponsive";

import { PROFILE_COLORS, PROFILE_RADIUS, PROFILE_SHADOW } from "../config/profileTheme";
import { useProfile } from "../hooks/useProfile";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileEditConfirmations from "../components/ProfileEditConfirmations";
import ProfileNoticeModal from "../components/ProfileNoticeModal";
import ProfileOverlay from "../components/ProfileOverlay";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { ChangePasswordDialog } from "../change-password/ChangePasswordDialog";
import ProfileModalContent from "./profileModal/ProfileModalContent";
import ProfileModalFooter from "./profileModal/ProfileModalFooter";
import ProfileModalHeader from "./profileModal/ProfileModalHeader";

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

const MODAL_MAX_WIDTH = 1180;

const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
  const state = useProfile({ onAfterLogout: onClose });
  const frame = useModalFrame(MODAL_MAX_WIDTH);
  const twoColumn = useResponsive().isDesktop;
  const title = state.profile?.role.title ?? "Profile";

  return (
    <>
      <ProfileOverlay visible={visible} onClose={onClose} accessibilityLabel={title}>
        <View
          style={{
            width: frame.width,
            maxHeight: frame.maxHeight,
            borderRadius: PROFILE_RADIUS.modal,
            backgroundColor: PROFILE_COLORS.surface,
            overflow: "hidden",
            ...PROFILE_SHADOW.modal,
          }}
        >
          <ProfileModalHeader title={title} onClose={onClose} />

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 24, gap: 18 }}
            showsVerticalScrollIndicator={false}
          >
            {state.loading ? (
              <ProfileSkeleton twoColumn={twoColumn} />
            ) : !state.profile ? (
              <ProfileErrorState onRetry={state.retry} />
            ) : (
              <ProfileModalContent state={state} twoColumn={twoColumn} />
            )}
          </ScrollView>

          <ProfileModalFooter onClose={onClose} onRequestLogout={state.requestLogout} />
        </View>
      </ProfileOverlay>

      <LogoutConfirmModal
        visible={state.logoutVisible}
        busy={state.loggingOut}
        onCancel={state.cancelLogout}
        onConfirm={state.confirmLogout}
      />

      <ProfileNoticeModal notice={state.notice} onClose={state.dismissNotice} />

      <ProfileEditConfirmations edit={state.edit} />

      <ChangePasswordDialog
        visible={state.changePasswordVisible}
        onClose={state.closeChangePassword}
        onSuccess={() => state.edit.showToast("Password changed")}
      />

    </>
  );
};

export default ProfileModal;
