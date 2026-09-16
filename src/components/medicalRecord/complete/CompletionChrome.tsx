import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";

export const ErrorBanner = ({ message }: { message: string }) => {
  const palette = useQueuePalette();
  return (
    <View
      accessibilityRole="alert"
      className="w-full flex-row items-start gap-2.5 p-3"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        borderWidth: 1,
        borderColor: palette.isDark ? "rgba(220,38,38,0.32)" : "#FECACA",
        backgroundColor: palette.isDark ? "rgba(220,38,38,0.14)" : "#FEF2F2",
      }}
    >
      <Feather name="alert-circle" size={15} color="#DC2626" style={{ marginTop: 1 }} />
      <Text className="min-w-0 flex-1 text-[12.5px] font-medium leading-[17px]" style={{ color: "#DC2626" }}>
        {message}
      </Text>
    </View>
  );
};

export const CompletionPlaceholder = ({
  message,
  error = false,
}: {
  message: string;
  error?: boolean;
}) => {
  const palette = useQueuePalette();
  return (
    <View className="items-center gap-2.5 px-6 py-12">
      {error ? (
        <Feather name="alert-triangle" size={22} color={palette.subtle} />
      ) : (
        <ActivityIndicator size="small" color={palette.primary} />
      )}
      <Text className="text-center text-[12.5px] leading-[18px]" style={{ color: palette.muted }}>
        {message}
      </Text>
    </View>
  );
};

export const FooterButtons = ({
  backLabel,
  onBack,
  nextLabel,
  onNext,
  busy,
  disabled,
}: {
  backLabel: string;
  onBack: () => void;
  nextLabel: string;
  onNext: () => void;
  busy: boolean;
  disabled: boolean;
}) => {
  const palette = useQueuePalette();
  return (
    <View className="w-full flex-row gap-2.5">
      <Pressable
        onPress={onBack}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        className="h-11 flex-1 items-center justify-center"
        style={{
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.panelBorder,
          opacity: busy ? 0.5 : 1,
        }}
      >
        <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
          {backLabel}
        </Text>
      </Pressable>

      <Pressable
        onPress={onNext}
        disabled={busy || disabled}
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        accessibilityState={{ disabled: busy || disabled, busy }}
        className="h-11 flex-row items-center justify-center gap-2 px-5"
        style={{
          flex: 1.4,
          borderRadius: QUEUE_RADIUS.control,
          backgroundColor: palette.primary,
          opacity: busy || disabled ? 0.6 : 1,
        }}
      >
        {busy ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
        <Text className="text-[14px] font-semibold text-white">{nextLabel}</Text>
      </Pressable>
    </View>
  );
};
