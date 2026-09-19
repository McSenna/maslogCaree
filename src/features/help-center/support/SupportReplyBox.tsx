import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";
import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import { SUPPORT_LIMITS } from "../constants/support.constants";

type SupportReplyBoxProps = {
  sending: boolean;
  placeholder?: string;
  onSend: (body: string) => Promise<boolean>;
};

const SupportReplyBox = ({ sending, placeholder, onSend }: SupportReplyBoxProps) => {
  const palette = useResidentDialogPalette();
  const [body, setBody] = useState("");

  const canSend = body.trim().length > 0 && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    if (await onSend(body)) setBody("");
  };

  return (
    <View style={{ gap: 8 }}>
      <View
        {...INPUT_SHELL_PROPS}
        style={{
          borderRadius: RADIUS.control,
          backgroundColor: palette.cardRaised,
          borderWidth: 1,
          borderColor: palette.border,
        }}
      >
        <TextInput
          value={body}
          onChangeText={setBody}
          editable={!sending}
          placeholder={placeholder ?? "Write a reply..."}
          placeholderTextColor={palette.muted}
          accessibilityLabel="Reply message"
          multiline
          textAlignVertical="top"
          maxLength={SUPPORT_LIMITS.messageMax}
          style={
            {
              minHeight: 80,
              padding: 12,
              fontSize: 14,
              lineHeight: 20,
              color: palette.body,
              outlineStyle: "none",
            } as never
          }
        />
      </View>

      <Pressable
        onPress={() => void handleSend()}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSend, busy: sending }}
        style={{
          alignSelf: "flex-end",
          minHeight: 44,
          justifyContent: "center",
          paddingHorizontal: 20,
          borderRadius: RADIUS.control,
          backgroundColor: canSend ? palette.accent : palette.disabled,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700", color: canSend ? "#FFFFFF" : palette.muted }}>
          {sending ? "Sending..." : "Send Reply"}
        </Text>
      </Pressable>
    </View>
  );
};

export default SupportReplyBox;
