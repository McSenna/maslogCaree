import { useMemo } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import { SPACING } from "@/theme/spacing";
import type { ProfileScreenState } from "../hooks/useProfileScreen";
import type { ProfileData } from "../utils/profileData";
import { buildProfileGroups } from "../utils/profileGroups";
import ProfileHeaderCard from "./social/ProfileHeaderCard";
import OverviewTab from "./tabs/OverviewTab";
import ProfileTabPanel from "./tabs/ProfileTabPanel";

type ProfileScreenContentProps = {
  profile: ProfileData;
  state: ProfileScreenState;
  wide: boolean;
  twoColumn: boolean;
  onBookAppointment?: () => void;
  onTabPanelLayout: (event: LayoutChangeEvent) => void;
  onPersonalCardLayout: (event: LayoutChangeEvent) => void;
};

const ProfileScreenContent = ({
  profile,
  state,
  wide,
  twoColumn,
  onBookAppointment,
  onTabPanelLayout,
  onPersonalCardLayout,
}: ProfileScreenContentProps) => {
  const groups = useMemo(() => buildProfileGroups(profile), [profile]);
  const { insights, tabs } = state;

  return (
    <View style={{ gap: SPACING.lg }}>
      <ProfileHeaderCard
        profile={profile}
        wide={wide}
        actionsInline={twoColumn}
        stats={insights.stats}
        statsLoading={insights.loading}
        statsUnavailable={Boolean(insights.error)}
        tabs={tabs}
        onEditProfile={state.onEditProfile}
        onBookAppointment={onBookAppointment}
        onChangePhoto={state.onChangePhoto}
        changingPhoto={state.edit.savingAvatar}
      />

      <View onLayout={onTabPanelLayout}>
        {tabs.activeTab === "overview" ? (
          <OverviewTab
            profile={profile}
            groups={groups}
            state={state}
            twoColumn={twoColumn}
            onPersonalCardLayout={onPersonalCardLayout}
          />
        ) : (
          <ProfileTabPanel
            activeTab={tabs.activeTab}
            insights={insights}
            twoColumn={twoColumn}
            isResident={state.isResident}
          />
        )}
      </View>
    </View>
  );
};

export default ProfileScreenContent;
