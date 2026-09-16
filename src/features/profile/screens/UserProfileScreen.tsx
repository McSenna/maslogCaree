import { useCallback, useRef } from "react";
import { ScrollView, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { PROFILE_MAX_WIDTH, SOCIAL_COLORS } from "../config/profileSocialTheme";
import { useProfileScreen } from "../hooks/useProfileScreen";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileNoticeModal from "../components/ProfileNoticeModal";
import ProfileScreenContent from "../components/ProfileScreenContent";
import ProfileScreenSkeleton from "../components/ProfileScreenSkeleton";
import ProfileToastLayer from "../components/ProfileToastLayer";
import EditProfileDialog from "../modals/EditProfileDialog";

const SETTINGS_SCROLL_OFFSET = 12;

const UserProfileScreen = () => {
  const state = useProfileScreen();
  const { width } = useWindowDimensions();

  const scrollRef = useRef<ScrollView>(null);
  const settingsOffset = useRef(0);

  const wide = width >= BREAKPOINTS.tablet;
  const twoColumn = width >= BREAKPOINTS.desktop;
  const stacked = width < 380;

  const handleSettingsLayout = useCallback((event: LayoutChangeEvent) => {
    settingsOffset.current = event.nativeEvent.layout.y;
  }, []);

  const scrollToSettings = useCallback(() => {
    state.tabs.selectTab("overview");
    scrollRef.current?.scrollTo({
      y: Math.max(settingsOffset.current - SETTINGS_SCROLL_OFFSET, 0),
      animated: true,
    });
  }, [state.tabs]);

  const showSkeleton = state.loading || (state.refreshing && !state.profile);

  return (
    <View style={{ flex: 1, backgroundColor: SOCIAL_COLORS.background }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wide ? 4 : 7,
          paddingVertical: 12,
          paddingBottom: 28,
        }}
      >
        <View style={{ width: "100%", maxWidth: PROFILE_MAX_WIDTH, alignSelf: "center" }}>
          {showSkeleton ? (
            <ProfileScreenSkeleton wide={wide} twoColumn={twoColumn} />
          ) : !state.profile ? (
            <ProfileErrorState
              onRetry={state.reloadAll}
              message={state.refreshError ?? undefined}
            />
          ) : (
            <ProfileScreenContent
              profile={state.profile}
              state={state}
              wide={wide}
              twoColumn={twoColumn}
              stacked={stacked}
              onSettingsLayout={handleSettingsLayout}
              onOpenSettings={scrollToSettings}
            />
          )}
        </View>
      </ScrollView>

      <EditProfileDialog profile={state.profile} edit={state.edit} />

      <LogoutConfirmModal
        visible={state.logoutVisible}
        busy={state.loggingOut}
        onCancel={state.cancelLogout}
        onConfirm={state.confirmLogout}
      />

      <ProfileNoticeModal notice={state.notice} onClose={state.dismissNotice} />

      <ConfirmationModal
        visible={state.edit.editConfirmingDiscard}
        title="Discard unsaved changes?"
        message="Your edits have not been saved. If you leave now, they will be lost."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        destructive
        onConfirm={state.edit.confirmDiscardEditProfile}
        onCancel={state.edit.cancelDiscardEditProfile}
      />

      <ProfileToastLayer toast={state.edit.toast} onDismiss={state.edit.hideToast} />
    </View>
  );
};

export default UserProfileScreen;
