import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";

export type EmptyVariant = "no-records" | "no-matches" | "error";

const MedicalRecordEmptyState = ({
  variant,
  palette,
  onRetry,
  onClearFilters,
}: {
  variant: EmptyVariant;
  palette: QueuePalette;
  onRetry?: () => void;
  onClearFilters?: () => void;
}) => {
  const isError = variant === "error";
  const tint = isError ? palette.statuses.declined : null;

  const copy = {
    "no-records": {
      title: "No Medical Records Yet",
      body: "Your completed healthcare appointments and medical records will appear here.",
    },
    "no-matches": {
      title: "No records match your search",
      body: "Try a different service, a wider date range, or clear the search box.",
    },
    error: {
      title: "Unable to load medical records",
      body: "We couldn't retrieve your records right now. Please try again.",
    },
  }[variant];

  const action = isError
    ? onRetry
      ? { label: "Retry", onPress: onRetry }
      : null
    : variant === "no-matches" && onClearFilters
      ? { label: "Clear filters", onPress: onClearFilters }
      : null;

  return (
    <View
      className="w-full items-center gap-3 px-6 py-12"
      style={{
        borderRadius: QUEUE_RADIUS.panel,
        borderWidth: 1,
        borderColor: isError ? tint!.bg : palette.panelBorder,
        backgroundColor: isError ? tint!.bg : palette.panelBg,
      }}
    >
      <View
        className="items-center justify-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isError ? palette.panelBg : palette.skeleton,
        }}
      >
        {isError ? (
          <Feather name="wifi-off" size={22} color={tint!.dot} />
        ) : (
          <MaterialCommunityIcons
            name={variant === "no-matches" ? "file-search-outline" : "clipboard-pulse-outline"}
            size={24}
            color={palette.subtle}
          />
        )}
      </View>

      <View className="items-center gap-1.5">
        <Text
          accessibilityRole="header"
          className="text-center text-[15px] font-bold"
          style={{ color: isError ? tint!.fg : palette.heading }}
        >
          {copy.title}
        </Text>
        <Text
          className="max-w-[320px] text-center text-[13px] leading-[19px]"
          style={{ color: isError ? tint!.fg : palette.muted }}
        >
          {copy.body}
        </Text>
      </View>

      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className="h-11 flex-row items-center justify-center gap-2 px-5 active:opacity-85"
          style={{
            borderRadius: QUEUE_RADIUS.control,
            backgroundColor: isError ? palette.panelBg : palette.primarySoft,
            borderWidth: 1,
            borderColor: isError ? tint!.dot : palette.primary,
          }}
        >
          {isError ? <Feather name="refresh-cw" size={14} color={tint!.fg} /> : null}
          <Text
            className="text-[13.5px] font-semibold"
            style={{ color: isError ? tint!.fg : palette.primary }}
          >
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default MedicalRecordEmptyState;
