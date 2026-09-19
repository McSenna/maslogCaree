import { useEffect, useRef } from "react";
import { Platform, Pressable, ScrollView, View, useWindowDimensions } from "react-native";

import { MODAL_BACKDROP_DARK, MODAL_BACKDROP_LIGHT, MODAL_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import AdminSupportConversation from "./AdminSupportConversation";
import AdminSupportModalHeader from "./AdminSupportModalHeader";
import AdminSupportRequestDetails from "./AdminSupportRequestDetails";
import AdminSupportResponseForm from "./AdminSupportResponseForm";
import AdminSupportSidebarInfo from "./AdminSupportSidebarInfo";
import type { SupportStatus, SupportTicket } from "../../types/support.types";

type AdminSupportReviewModalProps = {
  ticket: SupportTicket;
  busy: boolean;
  onClose: () => void;
  onStatusChange: (status: SupportStatus) => void;
  onSendReply: (body: string) => Promise<boolean>;
};

const AdminSupportReviewModal = ({
  ticket,
  busy,
  onClose,
  onStatusChange,
  onSendReply,
}: AdminSupportReviewModalProps) => {
  const palette = useAdminSurfacePalette();
  const { width, height } = useWindowDimensions();
  const isTwoColumn = width >= 920;
  const messagesScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesScrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [ticket.messages.length]);

  const cardBg = palette.isDark ? palette.cardBg : "#FFFFFF";
  const cardBorder = palette.isDark ? palette.cardBorder : "rgba(226, 232, 240, 0.85)";

  return (
    <View
      accessibilityRole="none"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ease-out"
      style={{
        position: "fixed" as never,
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: palette.isDark ? MODAL_BACKDROP_DARK : MODAL_BACKDROP_LIGHT,
        alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: 16,
        ...Platform.select({
          web: { backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)" } as object,
        }),
      }}
    >
      <Pressable onPress={onClose} accessibilityLabel="Dismiss modal backdrop" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />

      <View
        role={"dialog" as never}
        aria-modal={true}
        accessibilityLabel={`Review support request ${ticket.ticketNumber}`}
        className="w-full bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-700/80 shadow-2xl overflow-hidden flex flex-col"
        style={{
          width: "100%", maxWidth: 1080,
          height: Math.min(height * 0.88, 860), maxHeight: "90%",
          borderRadius: RADIUS.card, backgroundColor: cardBg,
          borderWidth: 1, borderColor: cardBorder,
          overflow: "hidden", display: "flex", flexDirection: "column",
          ...MODAL_SHADOW,
        }}
      >
        <View style={{ flexShrink: 0, zIndex: 10 }}>
          <AdminSupportModalHeader ticketNumber={ticket.ticketNumber} status={ticket.status} onClose={onClose} />
        </View>

        <View style={{ flex: 1, minHeight: 0, flexDirection: isTwoColumn ? "row" : "column", display: "flex", overflow: "hidden" }}>
          <View style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <ScrollView
              ref={messagesScrollRef}
              showsVerticalScrollIndicator
              style={{ flex: 1, minHeight: 0 }}
              contentContainerStyle={{ padding: 20, gap: 20 }}
            >
              {!isTwoColumn ? <AdminSupportSidebarInfo ticket={ticket} busy={busy} onStatusChange={onStatusChange} /> : null}
              <AdminSupportRequestDetails subject={ticket.subject} description={ticket.description} attachments={ticket.attachments} />
              <AdminSupportConversation messages={ticket.messages} />
            </ScrollView>

            <View style={{ flexShrink: 0, paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: palette.divider, backgroundColor: cardBg, zIndex: 10 }}>
              <AdminSupportResponseForm sending={busy} onSend={onSendReply} />
            </View>
          </View>

          {isTwoColumn ? (
            <View style={{ width: 320, flexShrink: 0, borderLeftWidth: 1, borderLeftColor: palette.divider, display: "flex", minHeight: 0 }}>
              <ScrollView showsVerticalScrollIndicator style={{ flex: 1, minHeight: 0 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
                <AdminSupportSidebarInfo ticket={ticket} busy={busy} onStatusChange={onStatusChange} />
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default AdminSupportReviewModal;
