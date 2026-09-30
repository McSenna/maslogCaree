import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SHADOWS } from "@/theme/shadows";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { friendlyErrorMessage } from "@/utils/friendlyError";
import { dismissToast, type ToastMessage, type ToastTone } from "./toastStore";

// Shape and a spoken label carry the outcome, so it never rests on colour alone.
const ICONS: Record<ToastTone, keyof typeof Feather.glyphMap> = {
  success: "check",
  error: "alert-triangle",
  info: "info",
};

const SPOKEN: Record<ToastTone, string> = {
  success: "Success",
  error: "Error",
  info: "Notice",
};

const ICON_TILE = 32;
const CONTROL = 32;

const DismissButton = ({ onPress }: { onPress: () => void }) => {
  const colors = useThemeColors();
  const { hovered, pressed, focused, handlers } = useInteractionState();

  return (
    <Pressable
      {...handlers}
      accessibilityRole="button"
      accessibilityLabel="Dismiss notification"
      hitSlop={SPACING.sm}
      onPress={onPress}
      style={{
        width: CONTROL,
        height: CONTROL,
        borderRadius: RADII.small,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: hovered || pressed ? colors.surfaceHover : "transparent",
        outlineWidth: focused ? 2 : 0,
        outlineStyle: "solid",
        outlineColor: colors.focusRing,
      }}
    >
      <Feather name="x" size={16} color={colors.muted} />
    </Pressable>
  );
};

const ActionButton = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const colors = useThemeColors();
  const { hovered, pressed, focused, handlers } = useInteractionState();

  return (
    <Pressable
      {...handlers}
      accessibilityRole="button"
      onPress={onPress}
      style={{
        minHeight: CONTROL,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADII.small,
        justifyContent: "center",
        backgroundColor: hovered || pressed ? colors.primarySoft : "transparent",
        outlineWidth: focused ? 2 : 0,
        outlineStyle: "solid",
        outlineColor: colors.focusRing,
      }}
    >
      <Text style={[TYPE.label, { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
};

type ToastCardProps = {
  message: ToastMessage;
  onPauseChange: (paused: boolean) => void;
};

const ToastCard = ({ message, onPauseChange }: ToastCardProps) => {
  const colors = useThemeColors();
  const tone = message.tone === "success" ? colors.success : message.tone === "error" ? colors.danger : colors.info;
  const description =
    message.tone === "error" && message.description
      ? friendlyErrorMessage(message.description)
      : message.description;

  return (
    <View
      accessibilityRole={message.tone === "error" ? "alert" : "summary"}
      accessibilityLiveRegion={message.tone === "error" ? "assertive" : "polite"}
      // Reading or reaching for the toast holds it on screen.
      onPointerEnter={() => onPauseChange(true)}
      onPointerLeave={() => onPauseChange(false)}
      onFocus={() => onPauseChange(true)}
      onBlur={() => onPauseChange(false)}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: SPACING.md,
        padding: SPACING.md,
        paddingRight: SPACING.sm,
        borderRadius: RADII.medium,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        ...SHADOWS.overlay,
      }}
    >
      <View
        style={{
          width: ICON_TILE,
          height: ICON_TILE,
          borderRadius: RADII.small,
          borderWidth: 1,
          borderColor: tone.border,
          backgroundColor: tone.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name={ICONS[message.tone]} size={16} color={tone.fg} />
      </View>

      <View style={{ flex: 1, minWidth: 0, gap: SPACING.xxs, paddingTop: SPACING.xs }}>
        <Text
          accessibilityLabel={`${SPOKEN[message.tone]}: ${message.title}`}
          style={[TYPE.bodyStrong, { color: colors.heading }]}
        >
          {message.title}
        </Text>
        {description ? <Text style={[TYPE.body, { color: colors.muted }]}>{description}</Text> : null}
      </View>

      {message.action ? (
        <ActionButton
          label={message.action.label}
          onPress={() => {
            dismissToast(message.id);
            message.action?.onPress();
          }}
        />
      ) : null}

      <DismissButton onPress={() => dismissToast(message.id)} />
    </View>
  );
};

export default ToastCard;
