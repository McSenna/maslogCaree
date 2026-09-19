import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import SupportStatusBadge from "./SupportStatusBadge";
import { formatTicketDateTime } from "../utils/support.utils";
import type { SupportTicket } from "../types/support.types";

type SupportSubmittedStateProps = {
  ticket: SupportTicket;
  onViewRequests: () => void;
  onClose: () => void;
};

const SupportSubmittedState = ({
  ticket,
  onViewRequests,
  onClose,
}: SupportSubmittedStateProps) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ alignItems: "center", gap: 12, paddingVertical: 8 }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.successSoft,
        }}
      >
        <Feather name="check" size={26} color={palette.successFg} />
      </View>

      <Text
        accessibilityRole="header"
        style={{ fontSize: 17, fontWeight: "700", color: palette.heading, textAlign: "center" }}
      >
        Support Request Submitted
      </Text>
      <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.muted, textAlign: "center" }}>
        Your concern has been successfully sent to the MaslogCare support team.
      </Text>

      <View
        style={{
          alignSelf: "stretch",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderRadius: RADIUS.control,
          backgroundColor: palette.accentSoft,
          borderWidth: 1,
          borderColor: palette.accentBorder,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "700", color: palette.accent, letterSpacing: 0.5 }}>
          {ticket.ticketNumber}
        </Text>
        <SupportStatusBadge status={ticket.status} />
        <Text style={{ fontSize: 12, color: palette.muted }}>
          Submitted {formatTicketDateTime(ticket.createdAt)}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 4, alignSelf: "stretch" }}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          style={{
            flex: 1,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: RADIUS.control,
            borderWidth: 1,
            borderColor: palette.border,
            backgroundColor: palette.cardRaised,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: palette.body }}>Close</Text>
        </Pressable>

        <Pressable
          onPress={onViewRequests}
          accessibilityRole="button"
          style={{
            flex: 1.3,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: RADIUS.control,
            backgroundColor: palette.accent,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
            View Support Request
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SupportSubmittedState;
