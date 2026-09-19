import { useMemo } from "react";
import { View } from "react-native";

import AboutMaslogCareDialog from "@/components/about/AboutMaslogCareDialog";
import { HelpSupportOverlays } from "@/features/help-center";

import AccountSettingsCard from "../../components/AccountSettingsCard";
import HealthNoteStrip from "../../components/HealthNoteStrip";
import HelpSupportCard from "../../components/HelpSupportCard";
import ProfileHero from "../../components/ProfileHero";
import ProfileInfoCard from "../../components/ProfileInfoCard";
import type { useProfile } from "../../hooks/useProfile";
import { buildProfileGroups } from "../../utils/profileGroups";

type Props = {
  state: ReturnType<typeof useProfile>;
  twoColumn: boolean;
};

const ProfileModalContent = ({ state, twoColumn }: Props) => {
  const { profile } = state;
  const groups = useMemo(() => (profile ? buildProfileGroups(profile) : []), [profile]);

  if (!profile) return null;

  const columnStyle = {
    width: twoColumn ? undefined : ("100%" as const),
    gap: 14,
  };

  return (
    <>
      <ProfileHero
        profile={profile}
        variant="wide"
        onEditProfile={state.onEditProfile}
        onChangePhoto={state.onChangePhoto}
        changingPhoto={state.edit.savingAvatar}
      />

      <View
        style={{
          flexDirection: twoColumn ? "row" : "column",
          alignItems: "flex-start",
          gap: 18,
        }}
      >
        <View style={{ flex: twoColumn ? 1.15 : undefined, ...columnStyle }}>
          {groups.map((group) => (
            <ProfileInfoCard key={group.key} group={group} edit={state.edit} />
          ))}
          <HealthNoteStrip />
        </View>

        <View style={{ flex: twoColumn ? 1 : undefined, ...columnStyle }}>
          <AccountSettingsCard
            onChangePassword={state.onChangePassword}
            onNotificationSettings={state.onNotificationSettings}
          />
          <HelpSupportCard
            onHelpCenter={state.onHelpCenter}
            onContactSupport={state.onContactSupport}
            onSupportRequests={state.onSupportRequests}
            onPrivacySecurity={state.onPrivacySecurity}
            onAbout={state.onAbout}
            supportBadge={state.supportBadge}
            appVersion={state.appVersion}
          />
        </View>
      </View>

      <AboutMaslogCareDialog visible={state.aboutVisible} onClose={state.closeAbout} />

      <HelpSupportOverlays overlay={state.supportOverlay} />
    </>
  );
};

export default ProfileModalContent;
