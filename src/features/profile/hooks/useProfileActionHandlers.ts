import { showLegalDocument } from "@/features/legal/services/showLegalDocument";
import type { ProfileActionKey } from "../config/profileActions";
import type { ProfileState } from "./useProfile";

export type ProfileActionHandler = { onPress: () => void; value?: string; badge?: string };

export const getProfileActionHandlers = (
  state: ProfileState
): Record<ProfileActionKey, ProfileActionHandler> => ({
  changePassword: { onPress: state.onChangePassword },
  notificationSettings: { onPress: state.onNotificationSettings },
  helpCenter: { onPress: state.onHelpCenter },
  contactSupport: { onPress: state.onContactSupport },
  supportRequests: { onPress: state.onSupportRequests, badge: state.supportBadge },
  privacySecurity: { onPress: state.onPrivacySecurity },
  privacyPolicy: { onPress: () => showLegalDocument("privacy") },
  termsOfService: { onPress: () => showLegalDocument("terms") },
  about: { onPress: state.onAbout, value: state.appVersion },
});
