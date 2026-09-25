import { useRef } from "react";
import { ScrollView, View } from "react-native";
import AboutMaslogCareDialog from "@/components/about/AboutMaslogCareDialog";
import { HelpSupportOverlays } from "@/features/help-center";
import { useResponsive } from "@/hooks/useResponsive";
import { PROFILE_MAX_WIDTH, SOCIAL_COLORS } from "../config/profileSocialTheme";
import { useCardReveal } from "../hooks/useCardReveal";
import { useProfileScreen } from "../hooks/useProfileScreen";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ProfileEditConfirmations from "../components/ProfileEditConfirmations";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileNoticeModal from "../components/ProfileNoticeModal";
import ProfileScreenContent from "../components/ProfileScreenContent";
import ProfileScreenSkeleton from "../components/ProfileScreenSkeleton";
import { ChangePasswordDialog } from "../change-password/ChangePasswordDialog";

const UserProfileScreen = () => {
  const scrollRef = useRef<ScrollView>(null);

  const reveal = useCardReveal(scrollRef);
  const state = useProfileScreen({ onEditProfileStarted: reveal.revealCard });
  const { width, isMobile, isDesktop } = useResponsive();

  const wide = !isMobile;
  const twoColumn = isDesktop;
  const stacked = width < 380;

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
              onTabPanelLayout={reveal.onPanelLayout}
              onPersonalCardLayout={reveal.onCardLayout}
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

      <AboutMaslogCareDialog visible={state.aboutVisible} onClose={state.closeAbout} />

      <HelpSupportOverlays overlay={state.supportOverlay} />

      <ProfileEditConfirmations edit={state.edit} />

      <ChangePasswordDialog
        visible={state.changePasswordVisible}
        onClose={state.closeChangePassword}
        onSuccess={() => state.edit.showToast("Password changed")}
      />

    </View>
  );
};

export default UserProfileScreen;
