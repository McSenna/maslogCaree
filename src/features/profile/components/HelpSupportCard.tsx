import { View } from "react-native";
import ProfileSectionCard from "./ProfileSectionCard";
import SettingsRow, { type SettingsRowSize } from "./SettingsRow";

export type HelpSupportHandlers = {
  onHelpCenter?: () => void;
  onContactSupport?: () => void;
  onAbout?: () => void;
  appVersion?: string;
  size?: SettingsRowSize;
};

const HelpSupportCard = ({
  onHelpCenter,
  onContactSupport,
  onAbout,
  appVersion,
  size = "regular",
}: HelpSupportHandlers) => (
  <ProfileSectionCard title="Help & Support" icon="help-circle">
    <View>
      <SettingsRow
        label="Help Center"
        icon="file-text"
        onPress={onHelpCenter}
        size={size}
      />
      <SettingsRow
        label="Contact Support"
        icon="phone"
        onPress={onContactSupport}
        size={size}
      />
      <SettingsRow
        label="About MaslogCare"
        icon="info"
        value={appVersion}
        onPress={onAbout}
        size={size}
        showDivider={false}
      />
    </View>
  </ProfileSectionCard>
);

export default HelpSupportCard;
