import { useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

import BottomSheet from "@/components/ui/BottomSheet";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import AdminSupportConversation from "./AdminSupportConversation";
import AdminSupportRequestDetails from "./AdminSupportRequestDetails";
import AdminSupportResponseForm from "./AdminSupportResponseForm";
import AdminSupportSidebarInfo from "./AdminSupportSidebarInfo";
import AdminTicketStatusBadge from "../AdminTicketStatusBadge";
import type { SupportStatus, SupportTicket } from "../../types/support.types";

type AdminSupportReviewMobileSheetProps = {
  visible: boolean;
  ticket: SupportTicket;
  busy: boolean;
  onClose: () => void;
  onStatusChange: (status: SupportStatus) => void;
  onSendReply: (body: string) => Promise<boolean>;
};

const AdminSupportReviewMobileSheet = ({
  visible,
  ticket,
  busy,
  onClose,
  onStatusChange,
  onSendReply,
}: AdminSupportReviewMobileSheetProps) => {
  const palette = useAdminSurfacePalette();
  const messagesScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesScrollRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [ticket.messages.length]);

  const cardBg = palette.isDark ? palette.cardBg : "#FFFFFF";

  const renderHeader = (requestClose: () => void) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: palette.divider,
        backgroundColor: cardBg,
      }}
    >
      <View style={{ gap: 2, flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: palette.primary, letterSpacing: 0.3 }}>
          {ticket.ticketNumber}
        </Text>
        <Text numberOfLines={1} style={{ fontSize: 14.5, fontWeight: "700", color: palette.heading }}>
          Review Support Request
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <AdminTicketStatusBadge status={ticket.status} />
        <Pressable
          onPress={requestClose}
          accessibilityRole="button"
          accessibilityLabel="Close support ticket sheet"
          hitSlop={8}
          style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" }}
        >
          <Feather name="x" size={18} color={palette.muted} />
        </Pressable>
      </View>
    </View>
  );

  const renderFooter = (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: palette.divider,
        backgroundColor: cardBg,
      }}
    >
      <AdminSupportResponseForm sending={busy} onSend={onSendReply} />
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={renderHeader}
      footer={renderFooter}
      accessibilityLabel={`Review support ticket ${ticket.ticketNumber}`}
      surface={cardBg}
      handleColor={palette.isDark ? "#475569" : "#CBD5E1"}
      maxHeightRatio={0.94}
    >
      <ScrollView
        ref={messagesScrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, minHeight: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 16 }}
      >
        <AdminSupportSidebarInfo ticket={ticket} busy={busy} onStatusChange={onStatusChange} />
        <AdminSupportRequestDetails
          subject={ticket.subject}
          description={ticket.description}
          attachments={ticket.attachments}
        />
        <AdminSupportConversation messages={ticket.messages} />
      </ScrollView>
    </BottomSheet>
  );
};

export default AdminSupportReviewMobileSheet;
