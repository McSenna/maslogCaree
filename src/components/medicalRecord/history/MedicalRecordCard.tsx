import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalRecord } from "@/services/medicalRecords";
import { formatDate } from "@/utils/dateFormatter";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import {
  providerNameOf,
  providerRoleLabelOf,
  serviceLabelOf,
  summarizeRecord,
} from "./recordPresenter";

const MedicalRecordCard = ({
  record,
  palette,
  onOpen,
}: {
  record: MedicalRecord;
  palette: QueuePalette;
  onOpen: (record: MedicalRecord) => void;
}) => {
  const visual = resolveVisual(getServiceVisual(record.serviceType), palette.isDark);
  const service = serviceLabelOf(record);
  const provider = providerNameOf(record);
  const role = providerRoleLabelOf(record);
  const when = formatDate(record.completedAt);
  const summary = summarizeRecord(record);
  const completed = palette.statuses.completed;

  return (
    <Pressable
      onPress={() => onOpen(record)}
      accessibilityRole="button"
      accessibilityLabel={`${service} on ${when}${provider ? `, ${provider}` : ""}. Completed. Open the full medical record.`}
      accessibilityHint="Opens the full medical record"
      className="w-full gap-3 p-4 active:opacity-80"
      style={{
        borderRadius: QUEUE_RADIUS.card,
        borderWidth: 1,
        borderColor: palette.panelBorder,
        backgroundColor: palette.panelBg,
      }}
    >
      <View className="w-full flex-row items-start gap-3">
        <View
          className="items-center justify-center"
          style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: visual.tint }}
        >
          <MaterialCommunityIcons name={visual.icon} size={20} color={visual.fg} />
        </View>

        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-[14.5px] font-bold" style={{ color: palette.heading }} numberOfLines={1}>
            {service}
          </Text>
          <Text className="text-[12.5px]" style={{ color: palette.muted }} numberOfLines={1}>
            {when}
          </Text>
          {provider ? (
            <Text className="text-[12.5px]" style={{ color: palette.body }} numberOfLines={1}>
              {provider}
              {role ? <Text style={{ color: palette.subtle }}>{`  ·  ${role}`}</Text> : null}
            </Text>
          ) : null}
        </View>
      </View>

      {summary ? (
        <Text className="text-[13px] leading-[19px]" style={{ color: palette.body }} numberOfLines={2}>
          {summary}
        </Text>
      ) : null}

      <View
        className="w-full flex-row items-center justify-between gap-3 pt-3"
        style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
      >
        <View
          className="flex-row items-center gap-1.5 px-2.5 py-1"
          style={{ borderRadius: QUEUE_RADIUS.pill, backgroundColor: completed.bg }}
        >
          <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: completed.dot }} />
          <Text className="text-[11.5px] font-semibold" style={{ color: completed.fg }}>
            Completed
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Text className="text-[12.5px] font-semibold" style={{ color: palette.primary }}>
            View Record
          </Text>
          <Feather name="chevron-right" size={15} color={palette.primary} />
        </View>
      </View>
    </Pressable>
  );
};

export default MedicalRecordCard;
