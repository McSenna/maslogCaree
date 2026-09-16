import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { formatDateTime } from "@/utils/dateFormatter";
import type { MedicalRecord } from "@/services/medicalRecords";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import {
  providerNameOf,
  providerRoleLabelOf,
  serviceLabelOf,
} from "./recordPresenter";

const MedicalRecordHeader = ({
  record,
  palette,
}: {
  record: MedicalRecord;
  palette: QueuePalette;
}) => {
  const visual = resolveVisual(getServiceVisual(record.serviceType), palette.isDark);
  const { date, time } = formatDateTime(record.completedAt);
  const provider = providerNameOf(record);
  const role = providerRoleLabelOf(record);
  const completed = palette.statuses.completed;

  return (
    <View className="w-full gap-3">
      <View className="flex-row items-start gap-3">
        <View
          className="items-center justify-center"
          style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: visual.tint }}
        >
          <MaterialCommunityIcons name={visual.icon} size={22} color={visual.fg} />
        </View>

        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text
              accessibilityRole="header"
              className="text-[17px] font-bold"
              style={{ color: palette.heading }}
            >
              {serviceLabelOf(record)}
            </Text>
            <View
              className="flex-row items-center gap-1.5 px-2.5 py-1"
              style={{ borderRadius: QUEUE_RADIUS.pill, backgroundColor: completed.bg }}
            >
              <Feather name="check-circle" size={11} color={completed.dot} />
              <Text className="text-[11.5px] font-semibold" style={{ color: completed.fg }}>
                Completed
              </Text>
            </View>
          </View>

          <Text className="text-[12.5px]" style={{ color: palette.muted }}>
            {time ? `${date} • ${time}` : date}
          </Text>
        </View>
      </View>

      {provider ? (
        <View
          className="w-full gap-0.5 px-3.5 py-2.5"
          style={{
            borderRadius: QUEUE_RADIUS.control,
            backgroundColor: palette.isDark ? "rgba(255,255,255,0.03)" : "#F6F9FD",
          }}
        >
          <Text className="text-[11px] font-semibold uppercase" style={{ color: palette.subtle, letterSpacing: 0.5 }}>
            Healthcare Provider
          </Text>
          <Text className="text-[13.5px] font-semibold" style={{ color: palette.heading }}>
            {provider}
            {role ? <Text style={{ color: palette.muted }}>{`  ·  ${role}`}</Text> : null}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default MedicalRecordHeader;
