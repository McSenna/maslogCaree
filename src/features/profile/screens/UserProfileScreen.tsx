import { useCallback, useRef } from "react";
import { ScrollView, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { PROFILE_MAX_WIDTH, SOCIAL_COLORS } from "../config/profileSocialTheme";
import { useCardReveal } from "../hooks/useCardReveal";
import { useProfileScreen } from "../hooks/useProfileScreen";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ProfileEditConfirmations from "../components/ProfileEditConfirmations";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileNoticeModal from "../components/ProfileNoticeModal";
import ProfileScreenContent from "../components/ProfileScreenContent";
import ProfileScreenSkeleton from "../components/ProfileScreenSkeleton";
import ProfileToastLayer from "../components/ProfileToastLayer";

const SETTINGS_SCROLL_OFFSET = 12;

const UserProfileScreen = () => {
  const scrollRef = useRef<ScrollView>(null);
  const settingsOffset = useRef(0);

  const reveal = useCardReveal(scrollRef);
  const state = useProfileScreen({ onEditProfileStarted: reveal.revealCard });
  const { width } = useWindowDimensions();

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
        onLayout={reveal.onViewportLayout}
        onScroll={reveal.onScroll}
        scrollEventThrottle={16}
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
              onTabPanelLayout={reveal.onPanelLayout}
              onPersonalCardLayout={reveal.onCardLayout}
              onOpenSettings={scrollToSettings}
            />
          )}
        </View>
      </ScrollView>

      <LogoutConfirmModal
        visible={state.logoutVisible}
        busy={state.loggingOut}
        onCancel={state.cancelLogout}
        onConfirm={state.confirmLogout}
      />

      <ProfileNoticeModal notice={state.notice} onClose={state.dismissNotice} />

      <ProfileEditConfirmations edit={state.edit} />

      <ProfileToastLayer toast={state.edit.toast} onDismiss={state.edit.hideToast} />
    </View>
  );
};

export default UserProfileScreen;
