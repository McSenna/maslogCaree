import { useRouter, type Href } from "expo-router";
import { View } from "react-native";

import { LEGAL_ROUTES } from "@/features/legal/legalContent";

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
  const router = useRouter();
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
          label="Privacy policy"
          description="What MaslogCare collects and how to ask about your data."
          icon="lock"
          onPress={() => router.push(LEGAL_ROUTES.privacy as Href)}
          size={size}
        />
        <SettingsRow
          label="Terms and conditions"
          description="The rules for using MaslogCare."
          icon="file-text"
          onPress={() => router.push(LEGAL_ROUTES.terms as Href)}
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
};

export default HelpSupportCard;
