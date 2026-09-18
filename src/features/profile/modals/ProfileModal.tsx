import { ScrollView, View, useWindowDimensions } from "react-native";

import { PROFILE_COLORS, PROFILE_RADIUS, PROFILE_SHADOW } from "../config/profileTheme";
import { useProfile } from "../hooks/useProfile";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileEditConfirmations from "../components/ProfileEditConfirmations";
import ProfileNoticeModal from "../components/ProfileNoticeModal";
import ProfileOverlay from "../components/ProfileOverlay";
import ProfileSkeleton from "../components/ProfileSkeleton";
import ProfileToastLayer from "../components/ProfileToastLayer";
import ProfileModalContent from "./profileModal/ProfileModalContent";
import ProfileModalFooter from "./profileModal/ProfileModalFooter";
import ProfileModalHeader from "./profileModal/ProfileModalHeader";

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

const TWO_COLUMN_MIN_WIDTH = 1024;
const MODAL_MAX_WIDTH = 1180;
const VIEWPORT_MARGIN = 40;

const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
  const state = useProfile({ onAfterLogout: onClose });
  const { width, height } = useWindowDimensions();

  const twoColumn = width >= TWO_COLUMN_MIN_WIDTH;
  const title = state.profile?.role.title ?? "Profile";

  return (
    <>
      <ProfileOverlay visible={visible} onClose={onClose} accessibilityLabel={title}>
        <View
          style={{
            width: Math.min(MODAL_MAX_WIDTH, width - VIEWPORT_MARGIN),
            maxHeight: Math.round(height * 0.88),
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

      <ProfileToastLayer toast={state.edit.toast} onDismiss={state.edit.hideToast} />
    </>
  );
};

export default ProfileModal;
