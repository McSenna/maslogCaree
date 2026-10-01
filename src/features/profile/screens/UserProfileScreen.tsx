import { useRef } from "react";
import { ScrollView, View } from "react-native";
import AboutMaslogCareDialog from "@/components/about/AboutMaslogCareDialog";
import { toast } from "@/components/feedback/toast/toastStore";
import { HelpSupportOverlays } from "@/features/help-center";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import { usePageMaxWidth, useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
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
  const { isMobile, isDesktop } = useResponsive();
  const maxWidth = usePageMaxWidth("content");
  const colors = useThemeColors();
  const navigation = useGuardedNavigation();

  const wide = !isMobile;
  const twoColumn = isDesktop;
  const bookAppointment = state.isResident
    ? () => navigation.push("/resident/appointments?book=1")
    : undefined;

  const showSkeleton = state.loading || (state.refreshing && !state.profile);

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onLayout={reveal.onViewportLayout}
        onScroll={reveal.onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: wide ? SPACING.xs : SPACING.sm,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.xxl,
        }}
      >
        <View style={{ width: "100%", maxWidth, alignSelf: "center" }}>
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
              onBookAppointment={bookAppointment}
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
        onSuccess={() => toast.success("Password changed")}
      />

    </View>
  );
};

export default UserProfileScreen;
