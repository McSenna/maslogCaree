import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import LogoutButton from "../components/LogoutButton";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ProfileAccordionList from "../components/ProfileAccordionList";
import ProfileColumns from "../components/ProfileColumns";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileOverlays from "../components/ProfileOverlays";
import ProfilePageHeader from "../components/ProfilePageHeader";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { PROFILE_MAX_WIDTH } from "../config/profileTheme";
import { useProfileScreen } from "../hooks/useProfileScreen";

const UserProfileScreen = () => {
  const state = useProfileScreen();
  const { isMobile, isDesktop } = useResponsive();
  const colors = useThemeColors();
  const showSkeleton = state.loading || (state.refreshing && !state.profile);

  const renderContent = () => {
    if (showSkeleton) return <ProfileSkeleton twoColumn={isDesktop} />;
    if (!state.profile) return <ProfileErrorState onRetry={state.reloadAll} message={state.refreshError ?? undefined} />;
    if (isMobile) return <ProfileAccordionList profile={state.profile} state={state} />;
    return <ProfileColumns profile={state.profile} state={state} twoColumn={isDesktop} />;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.page }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: isMobile ? SPACING.md : SPACING.lg,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.xxl,
        }}
      >
        <View style={{ width: "100%", maxWidth: PROFILE_MAX_WIDTH, alignSelf: "center", gap: SPACING.lg }}>
          {isMobile ? (
            <Text accessibilityRole="header" aria-level={1} style={{ ...TYPE.headline, color: colors.heading }}>
              Profile
            </Text>
          ) : null}

          {isMobile ? (
            renderContent()
          ) : (
            <View
              style={{
                borderRadius: RADII.large,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <ProfilePageHeader
                title={state.profile?.role.title ?? "Profile"}
                onEdit={state.profile && !state.edit.editingSection ? state.onEditProfile : undefined}
              />
              <View style={{ paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.xl }}>{renderContent()}</View>
            </View>
          )}

          {state.profile ? <LogoutButton onPress={state.requestLogout} /> : null}
        </View>
      </ScrollView>

      <LogoutConfirmModal
        visible={state.logoutVisible}
        busy={state.loggingOut}
        onCancel={state.cancelLogout}
        onConfirm={state.confirmLogout}
      />

      <ProfileOverlays state={state} />
    </KeyboardAvoidingView>
  );
};

export default UserProfileScreen;
