import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import { formatTicketDateTime } from "../utils/support.utils";
import type { SupportMessage } from "../types/support.types";

type SupportMessageItemProps = {
  message: SupportMessage;
};

const SupportMessageItem = ({ message }: SupportMessageItemProps) => {
  const palette = useResidentDialogPalette();
  const fromStaff = message.isStaffReply;

  return (
    <View style={{ alignItems: fromStaff ? "flex-start" : "flex-end", gap: 4 }}>
      <View
        style={{
          maxWidth: "92%",
          padding: 12,
          borderRadius: RADIUS.panel,
          backgroundColor: fromStaff ? palette.card : palette.accentSoft,
          borderWidth: 1,
          borderColor: fromStaff ? palette.border : palette.accentBorder,
        }}
      >
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: fromStaff ? palette.muted : palette.accent }}>
          {fromStaff ? message.authorName || "MaslogCare Support" : "You"}
        </Text>
        <Text style={{ marginTop: 3, fontSize: 13.5, lineHeight: 20, color: palette.body }}>
          {message.body}
        </Text>
      </View>

      <Text style={{ fontSize: 11, color: palette.muted }}>
        {formatTicketDateTime(message.createdAt)}
      </Text>
    </View>
  );
};

export default SupportMessageItem;
