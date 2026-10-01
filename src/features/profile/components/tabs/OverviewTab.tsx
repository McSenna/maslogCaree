import { View, type LayoutChangeEvent } from "react-native";
import { SPACING } from "@/theme/spacing";
import type { ProfileScreenState } from "../../hooks/useProfileScreen";
import type { ProfileInfoGroup } from "../../types/profile.types";
import type { ProfileData } from "../../utils/profileData";
import AccountSettingsCard from "../AccountSettingsCard";
import HelpSupportCard from "../HelpSupportCard";
import LogoutButton from "../LogoutButton";
import ProfileInfoCard from "../ProfileInfoCard";
import ProfileAboutCard from "../social/ProfileAboutCard";

type OverviewTabProps = {
  profile: ProfileData;
  groups: ProfileInfoGroup[];
  state: ProfileScreenState;
  twoColumn: boolean;
  onPersonalCardLayout?: (event: LayoutChangeEvent) => void;
};

/**
 * Desktop mirrors a Facebook profile: a narrow "About" column beside the main
 * column. Phones and tablets stack the same cards in reading order.
 */
const OverviewTab = ({ profile, groups, state, twoColumn, onPersonalCardLayout }: OverviewTabProps) => {
  const about = <ProfileAboutCard profile={profile} />;

  const details = groups.map((group) => (
    <ProfileInfoCard
      key={group.key}
      group={group}
      edit={state.edit}
      onLayout={group.key === "personal" ? onPersonalCardLayout : undefined}
    />
  ));

  const account = (
    <AccountSettingsCard
      onChangePassword={state.onChangePassword}
      onNotificationSettings={state.onNotificationSettings}
    />
  );

  const support = (
    <HelpSupportCard
      onHelpCenter={state.onHelpCenter}
      onContactSupport={state.onContactSupport}
      onSupportRequests={state.onSupportRequests}
      onPrivacySecurity={state.onPrivacySecurity}
      onAbout={state.onAbout}
      supportBadge={state.supportBadge}
      appVersion={state.appVersion}
    />
  );

  const logout = <LogoutButton onPress={state.requestLogout} />;

  if (!twoColumn) {
    return (
      <View style={{ gap: SPACING.lg }}>
        {about}
        {details}
        {account}
        {support}
        {logout}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: SPACING.lg }}>
      <View style={{ flexBasis: "38%", flexShrink: 0, maxWidth: 420, minWidth: 0, gap: SPACING.lg }}>
        {about}
        {support}
      </View>

      <View style={{ flex: 1, minWidth: 0, gap: SPACING.lg }}>
        {details}
        {account}
        {logout}
      </View>
    </View>
  );
};

export default OverviewTab;
