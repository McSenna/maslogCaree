import { View } from "react-native";

import AccountSettingsCard from "../../components/AccountSettingsCard";
import HealthNoteStrip from "../../components/HealthNoteStrip";
import HelpSupportCard from "../../components/HelpSupportCard";
import PersonalInformationCard from "../../components/PersonalInformationCard";
import ProfileHero from "../../components/ProfileHero";
import type { useProfile } from "../../hooks/useProfile";

type Props = {
  state: ReturnType<typeof useProfile>;
  twoColumn: boolean;
};

const ProfileModalContent = ({ state, twoColumn }: Props) => {
  if (!state.profile) return null;

  const columnStyle = {
    width: twoColumn ? undefined : ("100%" as const),
    gap: 14,
  };

  return (
    <>
      <ProfileHero
        profile={state.profile}
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
          <PersonalInformationCard
            fields={state.profile.fields}
            edit={state.edit}
          />
          <HealthNoteStrip />
        </View>

        <View style={{ flex: twoColumn ? 1 : undefined, ...columnStyle }}>
          <AccountSettingsCard
            onChangePassword={state.onChangePassword}
            onNotificationSettings={state.onNotificationSettings}
            onPrivacySecurity={state.onPrivacySecurity}
          />
          <HelpSupportCard
            onHelpCenter={state.onHelpCenter}
            onContactSupport={state.onContactSupport}
            onAbout={state.onAbout}
            appVersion={state.appVersion}
          />
        </View>
      </View>
    </>
  );
};

export default ProfileModalContent;
