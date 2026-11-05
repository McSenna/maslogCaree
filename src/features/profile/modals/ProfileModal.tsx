import { useRef } from "react";
import { ScrollView, View } from "react-native";

import { useModalFrame } from "@/hooks/useModalFrame";
import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";

import ProfileColumns from "../components/ProfileColumns";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileOverlay from "../components/ProfileOverlay";
import ProfileOverlays from "../components/ProfileOverlays";
import ProfilePageHeader from "../components/ProfilePageHeader";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { PROFILE_MAX_WIDTH, PROFILE_SHADOW } from "../config/profileTheme";
import { useProfileScreen } from "../hooks/useProfileScreen";

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

const AVATAR_SIZE = 96;

const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
  const state = useProfileScreen(visible);
  const frame = useModalFrame(PROFILE_MAX_WIDTH);
  const twoColumn = useResponsive().isDesktop;
  const colors = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  const { edit } = state;
  const isEditing = Boolean(edit.editingSection);

  // Leaving mid-edit asks first, like Cancel. Leaving mid-save would strand its result.
  const dismiss = () => {
    if (edit.editSaving) return;
    if (isEditing) {
      edit.requestCancelEdit();
      return;
    }
    onClose();
  };

  const startEditing = () => {
    if (!isEditing) state.onEditProfile();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      <ProfileOverlay
        visible={visible}
        onClose={dismiss}
        accessibilityLabel={state.profile?.role.title ?? "Profile"}
        dismissOnBackdropPress={!isEditing}
      >
        <View
          style={{
            width: frame.width,
            maxHeight: frame.maxHeight,
            borderRadius: RADII.modal,
            backgroundColor: colors.surface,
            overflow: "hidden",
            ...PROFILE_SHADOW.modal,
            // A shadow does not show on a dark page, so the edge needs a hairline there.
            ...(colors.scheme === "dark" ? { borderWidth: 1, borderColor: colors.border } : null),
          }}
        >
          <ProfilePageHeader
            title={state.profile?.role.title ?? "Profile"}
            onEdit={state.profile ? startEditing : undefined}
            onClose={dismiss}
          />

          <ScrollView
            ref={scrollRef}
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.xl }}
            showsVerticalScrollIndicator={false}
          >
            {state.loading ? (
              <ProfileSkeleton twoColumn={twoColumn} avatarSize={AVATAR_SIZE} />
            ) : !state.profile ? (
              <ProfileErrorState onRetry={state.retry} />
            ) : (
              <ProfileColumns profile={state.profile} state={state} twoColumn={twoColumn} />
            )}
          </ScrollView>
        </View>
      </ProfileOverlay>

      <ProfileOverlays state={state} />
    </>
  );
};

export default ProfileModal;
