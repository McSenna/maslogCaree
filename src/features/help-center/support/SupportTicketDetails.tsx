import { View } from "react-native";

import { DialogError, DialogStatus, InlineError } from "@/components/ui/dialog/DialogPieces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import SupportConversation from "./SupportConversation";
import SupportOverlayBackLink from "./SupportOverlayBackLink";
import SupportReplyBox from "./SupportReplyBox";
import SupportTicketMeta from "./SupportTicketMeta";
import type { SupportTicket } from "../types/support.types";

type SupportTicketDetailsProps = {
  ticket: SupportTicket | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  onSendReply: (body: string) => Promise<boolean>;
  onClose: () => void;
  onBack?: () => void;
};

const CLOSED_STATUSES = ["resolved", "closed"];

const SupportTicketDetails = ({
  ticket,
  loading,
  sending,
  error,
  onSendReply,
  onClose,
  onBack,
}: SupportTicketDetailsProps) => {
  const palette = useResidentDialogPalette();

  if (loading) return <DialogStatus palette={palette} message="Loading support request..." />;

  if (!ticket) {
    return (
      <DialogError
        palette={palette}
        title="Support request unavailable"
        message={error ?? "This support request could not be opened."}
        actionLabel="Close"
        onAction={onClose}
      />
    );
  }

  return (
    <View style={{ gap: 18 }}>
      {onBack ? <SupportOverlayBackLink label="My Support Requests" onPress={onBack} /> : null}

      <SupportTicketMeta ticket={ticket} />
      <SupportConversation messages={ticket.messages} />

      {error ? <InlineError palette={palette} message={error} /> : null}

      {CLOSED_STATUSES.includes(ticket.status) ? null : (
        <SupportReplyBox sending={sending} onSend={onSendReply} />
      )}
    </View>
  );
};

export default SupportTicketDetails;
