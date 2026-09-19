import { View } from "react-native";
import ProfileSectionCard from "./ProfileSectionCard";
import SettingsRow, { type SettingsRowSize } from "./SettingsRow";

export type AccountSettingsHandlers = {
  onChangePassword?: () => void;
  onNotificationSettings?: () => void;
  size?: SettingsRowSize;
};

const AccountSettingsCard = ({
  onChangePassword,
  onNotificationSettings,
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
        showDivider={false}
      />
    </View>
  </ProfileSectionCard>
);

export default AccountSettingsCard;
