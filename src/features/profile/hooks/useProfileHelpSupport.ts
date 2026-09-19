import { useAuth } from "@/contexts/AuthContext";
import { useHelpSupportOverlay, useSupportTicketSummary } from "@/features/help-center";
import type { HelpSupportOverlayState } from "@/features/help-center";

export type ProfileHelpSupportState = {
  supportOverlay: HelpSupportOverlayState;
  supportBadge?: string;
  supportBadgeLoading: boolean;
  onHelpCenter: () => void;
  onContactSupport: () => void;
  onSupportRequests: () => void;
  onPrivacySecurity: () => void;
};

export const useProfileHelpSupport = (): ProfileHelpSupportState => {
  const { user } = useAuth();
  const supportOverlay = useHelpSupportOverlay();
  const summary = useSupportTicketSummary(Boolean(user));

  return {
    supportOverlay,
    supportBadge: summary.badgeLabel,
    supportBadgeLoading: summary.loading,
    onHelpCenter: () => supportOverlay.open("helpCenter"),
    onContactSupport: () => supportOverlay.open("contactSupport"),
    onSupportRequests: () => supportOverlay.open("supportRequests"),
    onPrivacySecurity: () => supportOverlay.open("privacySecurity"),
  };
};
