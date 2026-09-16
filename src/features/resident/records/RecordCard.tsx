import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { statusLabel } from "@/utils/appointmentDisplay";

import { STATUS_ICON, STATUS_TONE } from "./recordPresentation";


export type RecordCardProps = {
  typeLabel: string;
  status: string;
  when: string;
  staff?: string;
  description?: string;
  declineReason?: string;
};

const RecordCard = ({ typeLabel, status, when, staff, description, declineReason }: RecordCardProps) => {
  const tone = STATUS_TONE[status] ?? STATUS_TONE.default;
  const icon = STATUS_ICON[status] ?? "activity";
  const hasNotes = Boolean(description || declineReason);

  return (
    <View
      className="gap-3 rounded-2xl border border-slate-200 bg-white p-4"
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${typeLabel}, ${statusLabel(status)}, ${when}${staff ? `, ${staff}` : ""}`}
    >
      <View className="flex-row items-center gap-3">
        <View className={`h-10 w-10 items-center justify-center rounded-full ${tone.bg}`}>
          <Feather name={icon} size={16} color={tone.icon} />
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
        <View className={`rounded-full px-2.5 py-1 ${tone.bg}`}>
          <Text className={`text-xs font-semibold ${tone.text}`}>{statusLabel(status)}</Text>
        </View>
      </View>

      {hasNotes ? (
        <View className="gap-1 border-t border-slate-100 pt-3">
          {description ? <Text className="text-sm leading-5 text-slate-600">{description}</Text> : null}
          {declineReason ? (
            <Text className="text-sm leading-5 text-rose-600">Note: {declineReason}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default RecordCard;
