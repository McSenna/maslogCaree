import { View } from "react-native";
import ProfileSectionCard from "./ProfileSectionCard";
import SettingsRow, { type SettingsRowSize } from "./SettingsRow";

export type AccountSettingsHandlers = {
  onChangePassword?: () => void;
  onNotificationSettings?: () => void;
  onPrivacySecurity?: () => void;
  /** "large" is the mobile treatment. */
  size?: SettingsRowSize;
};

/** Account Settings card — Change Password, Notifications, Privacy (§21). */
const AccountSettingsCard = ({
  onChangePassword,
  onNotificationSettings,
  onPrivacySecurity,
  size = "regular",
}: AccountSettingsHandlers) => (
  <ProfileSectionCard title="Account Settings" icon="settings" tone="green">
    <View>
      <SettingsRow
        label="Change Password"
        icon="lock"
        onPress={onChangePassword}
        size={size}
      />
      <SettingsRow
        label="Notification Settings"
        icon="bell"
        onPress={onNotificationSettings}
        size={size}
      />
      <SettingsRow
        label="Privacy & Security"
        icon="shield"
        onPress={onPrivacySecurity}
        size={size}
        showDivider={false}
      />
    </View>
  </ProfileSectionCard>
);

export default AccountSettingsCard;
