import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type AdminSupportResponseFormProps = {
  sending: boolean;
  onSend: (body: string) => Promise<boolean>;
};

const MAX_CHAR_COUNT = 3000;

const AdminSupportResponseForm = ({ sending, onSend }: AdminSupportResponseFormProps) => {
  const palette = useAdminSurfacePalette();
  const [body, setBody] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const canSubmit = body.trim().length > 0 && !sending;

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) {
      setValidationError("Please enter a response before sending.");
      return;
    }
    setValidationError(null);
    const success = await onSend(trimmed);
    if (success) {
      setBody("");
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: palette.subtle, letterSpacing: 0.4, textTransform: "uppercase" }}>
          Write Response
        </Text>
        <Text
          style={{
            fontSize: 11.5,
            color: body.length > MAX_CHAR_COUNT ? palette.negative : palette.muted,
            fontVariant: ["tabular-nums"],
          }}
        >
          {body.length} / {MAX_CHAR_COUNT}
        </Text>
      </View>

      <View
        style={{
          borderRadius: RADIUS.panel,
          backgroundColor: palette.cardBg,
          borderWidth: 1,
          borderColor: validationError ? palette.negative : palette.controlBorder,
          overflow: "hidden",
        }}
      >
        <TextInput
          multiline
          numberOfLines={3}
          maxLength={MAX_CHAR_COUNT}
          placeholder="Write an official response or instructions for the user..."
          placeholderTextColor={palette.subtle}
          value={body}
          onChangeText={(text) => {
            setBody(text);
            if (validationError && text.trim().length > 0) {
              setValidationError(null);
            }
          }}
          editable={!sending}
          style={{
            minHeight: 76,
            padding: 10,
            fontSize: 13.5,
            lineHeight: 20,
            color: palette.body,
            textAlignVertical: "top",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: palette.divider,
            backgroundColor: palette.subtleSurface,
          }}
        >
          <Text style={{ fontSize: 11.5, color: palette.muted }}>
            The requester will see this reply in their support portal.
          </Text>

          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Send response to ticket"
            style={({ hovered, pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: RADIUS.control,
              backgroundColor: canSubmit ? palette.primary : palette.isDark ? "#334155" : "#E2E8F0",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="send" size={13} color={canSubmit ? "#FFFFFF" : palette.muted} />
            )}
            <Text
              style={{
                fontSize: 12.5,
                fontWeight: "600",
                color: canSubmit ? "#FFFFFF" : palette.muted,
              }}
            >
              {sending ? "Sending..." : "Send Response"}
            </Text>
          </Pressable>
        </View>
      </View>

      {validationError ? (
        <Text style={{ fontSize: 12, color: palette.negative }}>{validationError}</Text>
      ) : null}
    </View>
  );
};

export default AdminSupportResponseForm;
