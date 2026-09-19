import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import SupportStatusBadge from "./SupportStatusBadge";
import { formatTicketDate, supportCategoryLabel } from "../utils/support.utils";
import type { SupportTicketSummary } from "../types/support.types";

type SupportTicketCardProps = {
  ticket: SupportTicketSummary;
  onPress: (ticketId: string) => void;
  showRequester?: boolean;
};

const MetaRow = ({ label, value }: { label: string; value: string }) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ minWidth: 0, flexGrow: 1, flexBasis: 130 }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: palette.subtle }}>{label}</Text>
      <Text numberOfLines={1} style={{ fontSize: 12.5, color: palette.body }}>
        {value}
      </Text>
    </View>
  );
};

const SupportTicketCard = ({ ticket, onPress, showRequester = false }: SupportTicketCardProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <Pressable
      onPress={() => onPress(ticket.id)}
      accessibilityRole="button"
      accessibilityLabel={`Open support request ${ticket.ticketNumber}`}
      style={{
        gap: 10,
        padding: 16,
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderWidth: 1,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 12.5, fontWeight: "700", color: palette.primary, letterSpacing: 0.3 }}>
          {ticket.ticketNumber}
        </Text>
        <View style={{ flex: 1 }} />
        <SupportStatusBadge status={ticket.status} />
      </View>

      <Text numberOfLines={2} style={{ fontSize: 14.5, fontWeight: "600", color: palette.heading }}>
        {ticket.subject}
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <MetaRow label="CATEGORY" value={supportCategoryLabel(ticket.category)} />
        {showRequester ? <MetaRow label="REQUESTER" value={ticket.requesterName || "—"} /> : null}
        <MetaRow label="SUBMITTED" value={formatTicketDate(ticket.createdAt)} />
        <MetaRow label="LAST UPDATED" value={formatTicketDate(ticket.lastActivityAt)} />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ fontSize: 12.5, fontWeight: "600", color: palette.primary }}>
          View details
        </Text>
        <Feather name="arrow-right" size={13} color={palette.primary} />
      </View>
    </Pressable>
  );
};

export default SupportTicketCard;
