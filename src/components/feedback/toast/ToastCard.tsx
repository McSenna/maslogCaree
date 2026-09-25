import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { friendlyErrorMessage } from "@/utils/friendlyError";
import { SHADOWS } from "@/theme/shadows";
import { dismissToast, type ToastMessage, type ToastTone } from "./toastStore";

const ICONS: Record<ToastTone, keyof typeof Feather.glyphMap> = {
  success: "check-circle",
  error: "alert-circle",
  info: "info",
};

const ToastCard = ({ message }: { message: ToastMessage }) => {
  const colors = useThemeColors();
  const description =
    message.tone === "error" && message.description
      ? friendlyErrorMessage(message.description)
      : message.description;
  const tone = message.tone === "success" ? colors.success : message.tone === "error" ? colors.danger : colors.info;

  return (
    <View
      accessibilityRole={message.tone === "error" ? "alert" : "summary"}
      accessibilityLiveRegion={message.tone === "error" ? "assertive" : "polite"}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingVertical: 12,
        paddingLeft: 14,
        paddingRight: 8,
        borderRadius: RADII.medium,
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 4,
        borderLeftColor: tone.fg,
        backgroundColor: colors.surface,
        ...SHADOWS.overlay,
      }}
    >
      <Feather name={ICONS[message.tone]} size={18} color={tone.fg} style={{ marginTop: 1 }} />
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.heading }}>{message.title}</Text>
        {description ? (
          <Text style={{ fontSize: 13, lineHeight: 18, color: colors.muted }}>{description}</Text>
        ) : null}
      </View>
      {message.action ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            dismissToast(message.id);
            message.action?.onPress();
          }}
          style={{ paddingHorizontal: 8, paddingVertical: 4, minHeight: 32, justifyContent: "center" }}
        >
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>{message.action.label}</Text>
        </Pressable>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
        hitSlop={8}
        onPress={() => dismissToast(message.id)}
        style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
      >
        <Feather name="x" size={16} color={colors.subtle} />
      </Pressable>
    </View>
  );
};

export default ToastCard;
