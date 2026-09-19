import { Text, View } from "react-native";

import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import SupportMessageItem from "./SupportMessageItem";
import type { SupportMessage } from "../types/support.types";

type SupportConversationProps = {
  messages: SupportMessage[];
};

const SupportConversation = ({ messages }: SupportConversationProps) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", color: palette.heading }}>
        Conversation
      </Text>

      {messages.length === 0 ? (
        <Text style={{ fontSize: 13, lineHeight: 19, color: palette.muted }}>
          No replies yet. The MaslogCare support team will respond to this request.
        </Text>
      ) : (
        <View style={{ gap: 14 }}>
          {messages.map((message) => (
            <SupportMessageItem key={message.id} message={message} />
          ))}
        </View>
      )}
    </View>
  );
};

export default SupportConversation;
