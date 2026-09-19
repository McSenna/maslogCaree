import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import SupportAttachmentRow from "./SupportAttachmentRow";
import SupportStatusBadge from "./SupportStatusBadge";
import { formatTicketDateTime, supportCategoryLabel } from "../utils/support.utils";
import type { SupportTicket } from "../types/support.types";

type SupportTicketMetaProps = {
  ticket: SupportTicket;
};

const MetaItem = ({ label, value }: { label: string; value: string }) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ minWidth: 0, flexGrow: 1, flexBasis: 150 }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: palette.muted }}>{label}</Text>
      <Text style={{ fontSize: 13, color: palette.body }}>{value}</Text>
    </View>
  );
};

const SupportTicketMeta = ({ ticket }: SupportTicketMetaProps) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: palette.accent, letterSpacing: 0.3 }}>
          {ticket.ticketNumber}
        </Text>
        <View style={{ flex: 1 }} />
        <SupportStatusBadge status={ticket.status} />
      </View>

      <Text style={{ fontSize: 16, fontWeight: "700", color: palette.heading }}>
        {ticket.subject}
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <MetaItem label="CATEGORY" value={supportCategoryLabel(ticket.category)} />
        <MetaItem label="SUBMITTED" value={formatTicketDateTime(ticket.createdAt)} />
        <MetaItem label="LAST UPDATED" value={formatTicketDateTime(ticket.lastActivityAt)} />
      </View>

      <View
        style={{
          padding: 12,
          borderRadius: RADIUS.panel,
          backgroundColor: palette.card,
          borderWidth: 1,
          borderColor: palette.border,
        }}
      >
        <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.body }}>
          {ticket.description}
        </Text>
      </View>

      {ticket.attachments.length > 0 ? (
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: palette.heading }}>
            Attachments
          </Text>
          {ticket.attachments.map((attachment) => (
            <SupportAttachmentRow
              key={attachment.id}
              fileName={attachment.fileName}
              fileSize={attachment.fileSize}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default SupportTicketMeta;
