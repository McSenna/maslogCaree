import { View } from "react-native";
import ProfileSectionCard from "./ProfileSectionCard";
import SettingsRow from "./SettingsRow";

export type AccountSettingsHandlers = {
  onChangePassword?: () => void;
  onNotificationSettings?: () => void;
};

const AccountSettingsCard = ({
  onChangePassword,
  onNotificationSettings,
}: AccountSettingsHandlers) => (
  <ProfileSectionCard title="Account settings">
    <View>
      <SettingsRow
        label="Change password"
        icon="lock"
        onPress={onChangePassword}
      />
      <SettingsRow
        label="Notification settings"
        icon="bell"
        onPress={onNotificationSettings}
      />
    </View>
  </ProfileSectionCard>
);

export default AccountSettingsCard;
