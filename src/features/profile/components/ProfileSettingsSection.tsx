import { View, type LayoutChangeEvent } from "react-native";
import AccountSettingsCard from "./AccountSettingsCard";
import HelpSupportCard from "./HelpSupportCard";
import LogoutButton from "./LogoutButton";

type ProfileSettingsSectionProps = {
  twoColumn: boolean;
  appVersion?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  onChangePassword: () => void;
  onNotificationSettings: () => void;
  onPrivacySecurity: () => void;
  onHelpCenter: () => void;
  onContactSupport: () => void;
  onAbout: () => void;
  onRequestLogout: () => void;
};

const ProfileSettingsSection = ({
  twoColumn,
  appVersion,
  onLayout,
  onChangePassword,
  onNotificationSettings,
  onPrivacySecurity,
  onHelpCenter,
  onContactSupport,
  onAbout,
  onRequestLogout,
}: ProfileSettingsSectionProps) => (
  <View onLayout={onLayout} style={{ gap: 14 }}>
    <View
      style={{
        flexDirection: twoColumn ? "row" : "column",
        alignItems: "flex-start",
        gap: twoColumn ? 16 : 14,
      }}
    >
      <View style={{ flex: twoColumn ? 1 : undefined, width: twoColumn ? undefined : "100%" }}>
        <AccountSettingsCard
          size="large"
          onChangePassword={onChangePassword}
          onNotificationSettings={onNotificationSettings}
          onPrivacySecurity={onPrivacySecurity}
        />
      </View>

      <View style={{ flex: twoColumn ? 1 : undefined, width: twoColumn ? undefined : "100%" }}>
        <HelpSupportCard
          size="large"
          onHelpCenter={onHelpCenter}
          onContactSupport={onContactSupport}
          onAbout={onAbout}
          appVersion={appVersion}
        />
      </View>
    </View>

    <LogoutButton onPress={onRequestLogout} />
  </View>
);

export default ProfileSettingsSection;
