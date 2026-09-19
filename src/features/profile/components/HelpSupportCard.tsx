import { View } from "react-native";

import { HELP_SUPPORT_MENU, type HelpSupportMenuKey } from "../config/helpSupportMenu";
import ProfileSectionCard from "./ProfileSectionCard";
import SettingsRow, { type SettingsRowSize } from "./SettingsRow";

export type HelpSupportHandlers = {
  onHelpCenter?: () => void;
  onContactSupport?: () => void;
  onSupportRequests?: () => void;
  onPrivacySecurity?: () => void;
  onAbout?: () => void;
  supportBadge?: string;
  appVersion?: string;
  size?: SettingsRowSize;
};

const HelpSupportCard = ({
  onHelpCenter,
  onContactSupport,
  onSupportRequests,
  onPrivacySecurity,
  onAbout,
  supportBadge,
  appVersion,
  size = "regular",
}: HelpSupportHandlers) => {
  const handlers: Record<HelpSupportMenuKey, (() => void) | undefined> = {
    helpCenter: onHelpCenter,
    contactSupport: onContactSupport,
    supportRequests: onSupportRequests,
    privacySecurity: onPrivacySecurity,
  };

  return (
    <ProfileSectionCard title="Help & Support" icon="help-circle">
      <View>
        {HELP_SUPPORT_MENU.map((entry) => (
          <SettingsRow
            key={entry.key}
            label={entry.label}
            description={entry.description}
            icon={entry.icon}
            badge={entry.key === "supportRequests" ? supportBadge : undefined}
            onPress={handlers[entry.key]}
            size={size}
          />
        ))}

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
};

export default HelpSupportCard;
