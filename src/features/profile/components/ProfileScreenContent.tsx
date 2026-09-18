import { useMemo } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import type { ProfileScreenState } from "../hooks/useProfileScreen";
import type { ProfileData } from "../utils/profileData";
import { buildProfileGroups } from "../utils/profileGroups";
import ProfileHeaderCard from "./social/ProfileHeaderCard";
import ProfileStats from "./social/ProfileStats";
import ProfileTabs from "./social/ProfileTabs";
import ProfileSettingsSection from "./ProfileSettingsSection";
import ProfileTabPanel from "./tabs/ProfileTabPanel";

type ProfileScreenContentProps = {
  profile: ProfileData;
  state: ProfileScreenState;
  wide: boolean;
  twoColumn: boolean;
  stacked: boolean;
  onTabPanelLayout: (event: LayoutChangeEvent) => void;
  onPersonalCardLayout: (event: LayoutChangeEvent) => void;
};

const ProfileScreenContent = ({
  profile,
  state,
  wide,
  twoColumn,
  stacked,
  onTabPanelLayout,
  onPersonalCardLayout,
}: ProfileScreenContentProps) => {
  const groups = useMemo(() => buildProfileGroups(profile), [profile]);
  const { insights, tabs } = state;

  return (
    <View style={{ gap: 14 }}>
      <ProfileHeaderCard
        profile={profile}
        wide={wide}
        onChangePhoto={state.onChangePhoto}
        changingPhoto={state.edit.savingAvatar}
      />

      <ProfileStats
        stats={insights.stats}
        loading={insights.loading}
        compact={!wide}
        unavailable={Boolean(insights.error)}
      />

      <ProfileTabs
        tabs={tabs.tabs}
        activeTab={tabs.activeTab}
        onSelect={tabs.selectTab}
        compact={!wide}
      />

      <View onLayout={onTabPanelLayout}>
        <ProfileTabPanel
          activeTab={tabs.activeTab}
          insights={insights}
          groups={groups}
          twoColumn={twoColumn}
          stacked={stacked}
          isResident={state.isResident}
          edit={state.edit}
          onPersonalCardLayout={onPersonalCardLayout}
        />
      </View>

      {tabs.activeTab === "overview" ? (
        <ProfileSettingsSection
          twoColumn={twoColumn}
          appVersion={state.appVersion}
          onChangePassword={state.onChangePassword}
          onNotificationSettings={state.onNotificationSettings}
          onPrivacySecurity={state.onPrivacySecurity}
          onHelpCenter={state.onHelpCenter}
          onContactSupport={state.onContactSupport}
          onAbout={state.onAbout}
          onRequestLogout={state.requestLogout}
        />
      ) : null}
    </View>
  );
};

export default ProfileScreenContent;
