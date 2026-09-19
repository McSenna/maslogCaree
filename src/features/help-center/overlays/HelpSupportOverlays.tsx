import ContactSupportOverlay from "./ContactSupportOverlay";
import HelpCenterContent from "../content/HelpCenterContent";
import PrivacySecurityContent from "../content/PrivacySecurityContent";
import SupportRequestsContent from "../content/SupportRequestsContent";
import SupportOverlayBackLink from "../support/SupportOverlayBackLink";
import ResponsiveSupportOverlay from "./ResponsiveSupportOverlay";
import { HELP_SUPPORT_OVERLAY_META, TICKET_OVERLAY_META } from "./helpSupportOverlayMeta";
import type { HelpSupportOverlayState } from "../hooks/useHelpSupportOverlay";

type HelpSupportOverlaysProps = {
  overlay: HelpSupportOverlayState;
  privacyCategoryId?: string | null;
};

const resolveMeta = (overlay: HelpSupportOverlayState) => {
  if (!overlay.activeKey) return null;
  if (overlay.activeKey === "supportRequests" && overlay.activeTicketId) {
    return TICKET_OVERLAY_META;
  }
  return HELP_SUPPORT_OVERLAY_META[overlay.activeKey];
};

const HelpSupportOverlays = ({ overlay }: HelpSupportOverlaysProps) => {
  const meta = resolveMeta(overlay);
  if (!meta || !overlay.activeKey) return null;

  const dismiss = () => {
    if (!overlay.goBack()) overlay.close();
  };

  if (overlay.activeKey === "contactSupport") {
    return (
      <ContactSupportOverlay
        onClose={dismiss}
        onViewRequests={overlay.openSupportRequests}
        onSubmittedChange={overlay.setSubmissionShown}
        onDismissRequest={overlay.handleDismissRequest}
      />
    );
  }

  const stackedBackLabel =
    overlay.canGoBack && !overlay.activeTicketId
      ? HELP_SUPPORT_OVERLAY_META[overlay.previousKey ?? "helpCenter"].title
      : null;

  return (
    <ResponsiveSupportOverlay
      open
      title={meta.title}
      icon={meta.icon}
      size={meta.size}
      onClose={overlay.close}
      onDismissRequest={overlay.handleDismissRequest}
    >
      {stackedBackLabel ? (
        <SupportOverlayBackLink label={stackedBackLabel} onPress={dismiss} />
      ) : null}

      {overlay.activeKey === "helpCenter" ? (
        <HelpCenterContent
          onContactSupport={overlay.openContactSupport}
          onViewRequests={overlay.openSupportRequests}
        />
      ) : null}

      {overlay.activeKey === "supportRequests" ? (
        <SupportRequestsContent
          activeTicketId={overlay.activeTicketId}
          onOpenTicket={overlay.openTicket}
          onBackToList={overlay.backToList}
          onContactSupport={overlay.openContactSupport}
        />
      ) : null}

      {overlay.activeKey === "privacySecurity" ? (
        <PrivacySecurityContent
          onContactSupport={overlay.openContactSupport}
          onViewRequests={overlay.openSupportRequests}
        />
      ) : null}
    </ResponsiveSupportOverlay>
  );
};

export default HelpSupportOverlays;
