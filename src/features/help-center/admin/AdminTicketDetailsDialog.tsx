

import AdminSupportReviewMobileSheet from "./review/AdminSupportReviewMobileSheet";
import AdminSupportReviewModal from "./review/AdminSupportReviewModal";
import AdminTicketModalFallback from "./review/AdminTicketModalFallback";
import { useAdminTicketDetails } from "../hooks/useAdminTicketDetails";
import { useResponsive } from "@/hooks/useResponsive";

type AdminTicketDetailsDialogProps = {
  ticketId: string | null;
  onClose: () => void;
  onChanged: () => void;
};

const AdminTicketDetailsDialog = ({
  ticketId,
  onClose,
  onChanged,
}: AdminTicketDetailsDialogProps) => {
  const { isDesktopWeb } = useResponsive();
  const { ticket, loading, busy, error, changeStatus, sendReply } = useAdminTicketDetails(
    ticketId,
    onChanged
  );

  const isDesktop = isDesktopWeb;

  if (!ticketId) return null;

  // Desktop keeps one dialog open from loading through loaded, like the user details modal.
  if (isDesktop) {
    return (
      <AdminSupportReviewModal
        ticket={ticket}
        loading={loading}
        error={error}
        busy={busy}
        onClose={onClose}
        onStatusChange={changeStatus}
        onSendReply={sendReply}
      />
    );
  }

  if (loading || !ticket) {
    return <AdminTicketModalFallback loading={loading} error={error} onClose={onClose} />;
  }

  return (
    <AdminSupportReviewMobileSheet
      visible
      ticket={ticket}
      busy={busy}
      onClose={onClose}
      onStatusChange={changeStatus}
      onSendReply={sendReply}
    />
  );
};

export default AdminTicketDetailsDialog;
