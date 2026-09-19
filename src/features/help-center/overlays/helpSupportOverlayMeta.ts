import type { Feather } from "@expo/vector-icons";

import type { HelpSupportOverlayKey } from "../hooks/useHelpSupportOverlay";
import type { SupportOverlaySize } from "./ResponsiveSupportOverlay";

type OverlayMeta = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  size: SupportOverlaySize;
};

export const HELP_SUPPORT_OVERLAY_META: Record<HelpSupportOverlayKey, OverlayMeta> = {
  helpCenter: { title: "Help Center", icon: "help-circle", size: "wide" },
  contactSupport: { title: "Contact Support", icon: "headphones", size: "form" },
  supportRequests: { title: "My Support Requests", icon: "inbox", size: "wide" },
  privacySecurity: { title: "Privacy & Security", icon: "shield", size: "content" },
};

export const TICKET_OVERLAY_META: OverlayMeta = {
  title: "Support Request",
  icon: "file-text",
  size: "content",
};
