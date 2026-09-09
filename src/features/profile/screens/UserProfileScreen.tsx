import { ScrollView, View, useWindowDimensions } from "react-native";
import { PROFILE_COLORS } from "../config/profileTheme";
import { useProfile } from "../hooks/useProfile";
import AccountSettingsCard from "../components/AccountSettingsCard";
import HelpSupportCard from "../components/HelpSupportCard";
import LogoutButton from "../components/LogoutButton";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import PersonalInformationCard from "../components/PersonalInformationCard";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileHero from "../components/ProfileHero";
import ProfileNoticeModal from "../components/ProfileNoticeModal";
import ProfileSkeleton from "../components/ProfileSkeleton";

/**
 * The MaslogCare profile screen — one component for admin, doctor, midwife,
 * BHW and resident.
 *
 * Everything role-specific (title, badge colour, identifier label, which rows
 * appear) comes from the role config via `useProfile`, so the five routes are
 * genuinely the same screen rather than five copies (§40, §41).
 */
export default function UserProfileScreen() {
  const state = useProfile();
  const { width } = useWindowDimensions();

  // Below ~380px the label/value pair is too tight for a long email on one
  // line, so those rows stack instead of overflowing the card.
  const stacked = width < 380;

  return (
    <View style={{ flex: 1, backgroundColor: PROFILE_COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 14,
          gap: 16,
          // RoleLayout already reserves the bottom-navigation and safe-area
          // clearance on the container this screen fills, so only the card's
          // own breathing room is added here.
          paddingBottom: 20,
        }}
      >
        {state.loading ? (
          <ProfileSkeleton />
        ) : !state.profile ? (
          <ProfileErrorState onRetry={state.retry} />
        ) : (
          <>
            <ProfileHero
              profile={state.profile}
              variant="compact"
              onEditProfile={state.onEditProfile}
              onChangePhoto={state.onChangePhoto}
            />

            <PersonalInformationCard
              fields={state.profile.fields}
              onEdit={state.onEditProfile}
              stacked={stacked}
            />

            <AccountSettingsCard
              size="large"
              onChangePassword={state.onChangePassword}
              onNotificationSettings={state.onNotificationSettings}
              onPrivacySecurity={state.onPrivacySecurity}
            />

            <HelpSupportCard
              size="large"
              onHelpCenter={state.onHelpCenter}
              onContactSupport={state.onContactSupport}
              onAbout={state.onAbout}
              appVersion={state.appVersion}
            />

            <LogoutButton onPress={state.requestLogout} />
          </>
        )}
      </ScrollView>

      <LogoutConfirmModal
        visible={state.logoutVisible}
        busy={state.loggingOut}
        onCancel={state.cancelLogout}
        onConfirm={state.confirmLogout}
      />

      <ProfileNoticeModal notice={state.notice} onClose={state.dismissNotice} />
    </View>
  );
}
