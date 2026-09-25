import { useEffect, useRef } from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";

import DetailsModalHeader from "@/components/ui/dialog/DetailsModalHeader";
import DetailsModalShell from "@/components/ui/dialog/DetailsModalShell";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import AdminTicketStatusBadge from "../AdminTicketStatusBadge";
import AdminSupportConversation from "./AdminSupportConversation";
import AdminSupportRequestDetails from "./AdminSupportRequestDetails";
import AdminSupportResponseForm from "./AdminSupportResponseForm";
import AdminSupportSidebarInfo from "./AdminSupportSidebarInfo";
import TicketLoadState from "./TicketLoadState";
import type { SupportStatus, SupportTicket } from "../../types/support.types";

const TITLE_ID = "support-review-title";
const MAX_WIDTH = 1080;
const MAX_HEIGHT = 860;
const TWO_COLUMN_WIDTH = 920;
const GUTTER = 28;

type AdminSupportReviewModalProps = {
  ticket: SupportTicket | null;
  loading: boolean;
  error: string | null;
  busy: boolean;
  onClose: () => void;
  onStatusChange: (status: SupportStatus) => void;
  onSendReply: (body: string) => Promise<boolean>;
};

const AdminSupportReviewModal = ({
  ticket,
  loading,
  error,
  busy,
  onClose,
  onStatusChange,
  onSendReply,
}: AdminSupportReviewModalProps) => {
  const palette = useAdminSurfacePalette();
  const { width, height } = useWindowDimensions();
  const isTwoColumn = width >= TWO_COLUMN_WIDTH;
  const messagesScrollRef = useRef<ScrollView>(null);
  const messageCount = ticket?.messages.length ?? 0;

  useEffect(() => {
    if (messageCount === 0) return;
    const timer = setTimeout(() => {
      messagesScrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messageCount]);

  const subtitle = ticket ? (
    <>
      <Text className="font-bold" style={{ color: palette.primary }}>
        {ticket.ticketNumber}
      </Text>
      {" · Reply to the requester and update the request status"}
    </>
  ) : (
    "Reply to the requester and update the request status"
  );

  return (
    <DetailsModalShell
      onClose={onClose}
      closeLabel="Close support request review"
      labelledBy={TITLE_ID}
      maxWidth={MAX_WIDTH}
      height={Math.min(height * 0.88, MAX_HEIGHT)}
      clip
    >
      <View className="px-7 pb-5 pt-7" style={{ flexShrink: 0 }}>
        <DetailsModalHeader
          icon="help-circle"
          title="Review Support Request"
          subtitle={subtitle}
          titleId={TITLE_ID}
          trailing={ticket ? <AdminTicketStatusBadge status={ticket.status} /> : null}
          closeLabel="Close support request review"
          onClose={onClose}
        />
      </View>

      {!ticket ? (
        <TicketLoadState loading={loading} error={error} onClose={onClose} />
      ) : (
        <View
          style={{
            flex: 1,
            minHeight: 0,
            flexDirection: isTwoColumn ? "row" : "column",
            borderTopWidth: 1,
            borderTopColor: palette.divider,
          }}
        >
          <View style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
            <ScrollView
              ref={messagesScrollRef}
              showsVerticalScrollIndicator
              style={{ flex: 1, minHeight: 0 }}
              contentContainerStyle={{ paddingHorizontal: GUTTER, paddingVertical: 22, gap: 20 }}
            >
              {!isTwoColumn ? (
                <AdminSupportSidebarInfo ticket={ticket} busy={busy} onStatusChange={onStatusChange} />
              ) : null}
              <AdminSupportRequestDetails
                subject={ticket.subject}
                description={ticket.description}
                attachments={ticket.attachments}
              />
              <AdminSupportConversation messages={ticket.messages} />
            </ScrollView>

            <View
              style={{
                flexShrink: 0,
                paddingHorizontal: GUTTER,
                paddingTop: 16,
                paddingBottom: 22,
                borderTopWidth: 1,
                borderTopColor: palette.divider,
              }}
            >
              <AdminSupportResponseForm sending={busy} onSend={onSendReply} />
            </View>
          </View>

          {isTwoColumn ? (
            <View
              style={{
                width: 320,
                flexShrink: 0,
                minHeight: 0,
                borderLeftWidth: 1,
                borderLeftColor: palette.divider,
                backgroundColor: palette.subtleSurface,
              }}
            >
              <ScrollView
                showsVerticalScrollIndicator
                style={{ flex: 1, minHeight: 0 }}
                contentContainerStyle={{ padding: 22, gap: 16 }}
              >
                <AdminSupportSidebarInfo ticket={ticket} busy={busy} onStatusChange={onStatusChange} />
              </ScrollView>
            </View>
          ) : null}
        </View>
      )}
    </DetailsModalShell>
  );
};

export default AdminSupportReviewModal;
