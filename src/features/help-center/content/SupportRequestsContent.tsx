import { View } from "react-native";

import SupportRequestsHeader from "../support/SupportRequestsHeader";
import SupportTicketDetails from "../support/SupportTicketDetails";
import SupportTicketList from "../support/SupportTicketList";
import { useSupportTicketDetails } from "../hooks/useSupportTicketDetails";
import { useSupportTickets } from "../hooks/useSupportTickets";

type SupportRequestsContentProps = {
  activeTicketId: string | null;
  onOpenTicket: (ticketId: string) => void;
  onBackToList: () => void;
  onContactSupport: () => void;
};

const SupportRequestsContent = ({
  activeTicketId,
  onOpenTicket,
  onBackToList,
  onContactSupport,
}: SupportRequestsContentProps) => {
  const list = useSupportTickets();
  const details = useSupportTicketDetails(activeTicketId);

  if (activeTicketId) {
    return (
      <SupportTicketDetails
        ticket={details.ticket}
        loading={details.loading}
        sending={details.sending}
        error={details.error}
        onSendReply={details.sendReply}
        onClose={onBackToList}
        onBack={onBackToList}
      />
    );
  }

  return (
    <View style={{ gap: 16 }}>
      <SupportRequestsHeader onContactSupport={onContactSupport} />

      <SupportTicketList
        tickets={list.tickets}
        loading={list.loading}
        loadingMore={list.loadingMore}
        hasMore={list.hasMore}
        error={list.error}
        emptyMessage="You haven't submitted any support requests."
        emptyActionLabel="Contact Support"
        onEmptyAction={onContactSupport}
        onOpenTicket={onOpenTicket}
        onLoadMore={() => void list.loadMore()}
        onRetry={() => void list.refresh()}
      />
    </View>
  );
};

export default SupportRequestsContent;
