export { default as HelpCenterScreen } from "./screens/HelpCenterScreen";
export { default as SupportRequestsScreen } from "./screens/SupportRequestsScreen";
export { default as AdminSupportScreen } from "./screens/AdminSupportScreen";

export { default as HelpSupportOverlays } from "./overlays/HelpSupportOverlays";
export { default as ResponsiveSupportOverlay } from "./overlays/ResponsiveSupportOverlay";
export { default as HelpCenterContent } from "./content/HelpCenterContent";
export { default as ContactSupportOverlay } from "./overlays/ContactSupportOverlay";
export { default as SupportRequestsContent } from "./content/SupportRequestsContent";
export { default as PrivacySecurityContent } from "./content/PrivacySecurityContent";
export { default as SupportTicketList } from "./support/SupportTicketList";
export { default as SupportStatusBadge } from "./support/SupportStatusBadge";

export { useHelpSearch } from "./hooks/useHelpSearch";
export { useSupportForm } from "./hooks/useSupportForm";
export { useSupportTickets } from "./hooks/useSupportTickets";
export { useSupportTicketDetails } from "./hooks/useSupportTicketDetails";
export { useSupportContact } from "./hooks/useSupportContact";
export { useSupportTicketSummary } from "./hooks/useSupportTicketSummary";
export { useHelpSupportOverlay } from "./hooks/useHelpSupportOverlay";
export type {
  HelpSupportOverlayKey,
  HelpSupportOverlayState,
} from "./hooks/useHelpSupportOverlay";

export {
  HELP_CATEGORIES,
  HELP_CATEGORY_IDS,
  findHelpCategory,
} from "./constants/helpCategories.constants";
export { HELP_FAQS } from "./constants/helpFaqs.constants";
export { ROLE_GUIDES, findRoleGuide } from "./constants/roleGuides.constants";
export {
  SUPPORT_CATEGORIES,
  SUPPORT_LIMITS,
  SUPPORT_STATUS_LABELS,
  SUPPORT_STATUS_ORDER,
} from "./constants/support.constants";

export { searchHelpContent } from "./utils/helpSearch";
export {
  formatFileSize,
  formatTicketDate,
  formatTicketDateTime,
  supportCategoryLabel,
  supportStatusLabel,
  buildSupportBadgeLabel,
} from "./utils/support.utils";
export { validateSupportForm, hasSupportErrors } from "./validation/supportValidation";

export type {
  HelpArticle,
  HelpCategory,
  HelpFaq,
  HelpSearchResult,
  RoleGuide,
} from "./types/helpCenter.types";

export type {
  SupportAttachment,
  SupportCategoryId,
  SupportContactInfo,
  SupportFormErrors,
  SupportFormValues,
  SupportMessage,
  SupportStatus,
  SupportTicket,
  SupportTicketPage,
  SupportTicketSummary,
} from "./types/support.types";
