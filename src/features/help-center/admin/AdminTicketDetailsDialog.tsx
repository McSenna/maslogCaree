import { Platform, useWindowDimensions } from "react-native";

import { BREAKPOINTS } from "@/constants/breakpoints";

import AdminSupportReviewMobileSheet from "./review/AdminSupportReviewMobileSheet";
import AdminSupportReviewModal from "./review/AdminSupportReviewModal";
import AdminTicketModalFallback from "./review/AdminTicketModalFallback";
import { useAdminTicketDetails } from "../hooks/useAdminTicketDetails";

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
  const { width } = useWindowDimensions();
  const { ticket, loading, busy, error, changeStatus, sendReply } = useAdminTicketDetails(
    ticketId,
    onChanged
  );

  const isDesktop = Platform.OS === "web" && width >= BREAKPOINTS.tablet;

  if (!ticketId) return null;

  if (loading || !ticket) {
    return <AdminTicketModalFallback loading={loading} error={error} onClose={onClose} />;
  }

  if (isDesktop) {
    return (
      <AdminSupportReviewModal
        ticket={ticket}
        busy={busy}
        onClose={onClose}
        onStatusChange={changeStatus}
        onSendReply={sendReply}
      />
    );
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
