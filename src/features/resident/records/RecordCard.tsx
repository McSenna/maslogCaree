import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { getStatusLabel, getStatusMeta } from "@/components/status/appointmentStatusModel";
import { getThemeColors } from "@/theme/colors";

// Resident record screens are light-only, like the rest of the resident app.
const colors = getThemeColors("light");

export type RecordCardProps = {
  typeLabel: string;
  status: string;
  when: string;
  staff?: string;
  description?: string;
  declineReason?: string;
  cancelReason?: string;
  hasRecord?: boolean;
  onPress?: () => void;
};

const RecordCard = ({
  typeLabel,
  status,
  when,
  staff,
  description,
  declineReason,
  cancelReason,
  hasRecord = false,
  onPress,
}: RecordCardProps) => {
  const meta = getStatusMeta(status, "resident");
  const tone = colors[meta.tone];
  const hasNotes = Boolean(description || declineReason || cancelReason);
  const isClickable = Boolean(onPress);

  const content = (
    <>
      <View className="flex-row items-center gap-3">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: tone.bg }}
        >
          <Feather name={meta.icon} size={16} color={tone.fg} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-slate-900" numberOfLines={1}>
            {typeLabel}
          </Text>
          <Text className="text-xs text-slate-500" numberOfLines={1}>
            {when}
            {staff ? ` · ${staff}` : ""}
          </Text>
        </View>
        <AppointmentStatusBadge status={status} audience="resident" />
      </View>

      {hasNotes ? (
        <View className="gap-1 border-t border-slate-200 pt-3">
          {description ? <Text className="text-sm leading-5 text-slate-600">{description}</Text> : null}
          {declineReason ? (
            <Text className="text-sm leading-5 text-red-700">Declined note: {declineReason}</Text>
          ) : null}
          {cancelReason ? (
            <Text className="text-sm leading-5 text-amber-700">Cancellation reason: {cancelReason}</Text>
          ) : null}
        </View>
      ) : null}

      {isClickable ? (
        <View className="flex-row items-center justify-between border-t border-slate-200 pt-3">
          <View className="flex-row items-center gap-1.5">
            <MaterialCommunityIcons
              name="clipboard-pulse-outline"
              size={14}
              color={colors.primary}
            />
            <Text className="text-xs font-semibold text-blue-700">
              View Medical Details
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </View>
      ) : null}
    </>
  );

  if (isClickable) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${typeLabel}, ${getStatusLabel(status, "resident")}, ${when}. Tap to view medical details.`}
        className="gap-3 rounded-lg border border-slate-200 bg-white p-4 active:opacity-80"
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      className="gap-3 rounded-lg border border-slate-200 bg-white p-4"
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${typeLabel}, ${getStatusLabel(status, "resident")}, ${when}${staff ? `, ${staff}` : ""}`}
    >
      {content}
    </View>
  );
};

export default RecordCard;
