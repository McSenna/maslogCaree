import { View } from "react-native";
import { LEGAL_CATALOG } from "@/features/legal/constants/legalCatalog";
import { showLegalDocument } from "@/features/legal/services/showLegalDocument";

import {
  HELP_SUPPORT_MENU,
  type HelpSupportMenuKey,
} from "../config/helpSupportMenu";
import ProfileSectionCard from "./ProfileSectionCard";
import SettingsRow from "./SettingsRow";

export type HelpSupportHandlers = {
  onHelpCenter?: () => void;
  onContactSupport?: () => void;
  onSupportRequests?: () => void;
  onPrivacySecurity?: () => void;
  onAbout?: () => void;
  supportBadge?: string;
  appVersion?: string;
};

const HelpSupportCard = ({
  onHelpCenter,
  onContactSupport,
  onSupportRequests,
  onPrivacySecurity,
  onAbout,
  supportBadge,
  appVersion,
}: HelpSupportHandlers) => {
  const handlers: Record<HelpSupportMenuKey, (() => void) | undefined> = {
    helpCenter: onHelpCenter,
    contactSupport: onContactSupport,
    supportRequests: onSupportRequests,
    privacySecurity: onPrivacySecurity,
  };

  return (
    <ProfileSectionCard title="Help and support">
      <View>
        {HELP_SUPPORT_MENU.map((entry) => (
          <SettingsRow
            key={entry.key}
            label={entry.label}
            description={entry.description}
            icon={entry.icon}
            badge={entry.key === "supportRequests" ? supportBadge : undefined}
            onPress={handlers[entry.key]}
          />
        ))}

        <SettingsRow
          label={LEGAL_CATALOG.privacy.title}
          description={LEGAL_CATALOG.privacy.description}
          icon="lock"
          onPress={() => showLegalDocument("privacy")}
        />
        <SettingsRow
          label={LEGAL_CATALOG.terms.title}
          description={LEGAL_CATALOG.terms.description}
          icon="file-text"
          onPress={() => showLegalDocument("terms")}
        />

        <SettingsRow
          label="About MaslogCare"
          icon="info"
          value={appVersion}
          onPress={onAbout}
        />
      </View>
    </ProfileSectionCard>
  );
};

export default HelpSupportCard;
