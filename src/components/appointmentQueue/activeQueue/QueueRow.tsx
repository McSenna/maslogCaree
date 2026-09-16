import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";

import StatusBadge from "../StatusBadge";
import { QUEUE_RADIUS, type QueuePalette } from "../queueTheme";

const QueueNumber = ({ index, palette }: { index: number; palette: QueuePalette }) => {
  return (
    <View
      className="h-11 w-11 items-center justify-center"
      style={{ borderRadius: QUEUE_RADIUS.control, backgroundColor: palette.primarySoft }}
    >
      <Text className="text-[10px] font-semibold" style={{ color: palette.primary, opacity: 0.75 }}>
        #
      </Text>
      <Text className="text-[14px] font-bold leading-[16px]" style={{ color: palette.primary }}>
        {String(index).padStart(2, "0")}
      </Text>
    </View>
  );
};

const QueueRow = ({
  appointment,
  index,
  serviceLabel,
  isLast,
  canComplete,
  busy,
  onComplete,
  onView,
  palette,
}: {
  appointment: AppointmentRecord;
  index: number;
  serviceLabel: string;
  isLast: boolean;
  canComplete: boolean;
  busy: boolean;
  onComplete: (appointment: AppointmentRecord) => void;
  onView?: (appointment: AppointmentRecord) => void;
  palette: QueuePalette;
}) => {
  const [hovered, setHovered] = useState(false);
  const time = appointment.slotStart ? formatDateTime(appointment.slotStart).time : "—";
  const isServing = appointment.status === "processing";

  return (
    <View
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="w-full flex-row items-center gap-3 px-4 py-3"
      style={{
        backgroundColor: hovered ? palette.rowHover : "transparent",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <QueueNumber index={index} palette={palette} />

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 text-[14.5px] font-semibold"
            style={{ color: palette.heading }}
          >
            {appointment.resident?.fullname || "Unnamed patient"}
          </Text>
          {isServing ? <StatusBadge status="processing" /> : null}
        </View>
        <Text numberOfLines={1} className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
          {serviceLabel} · {time}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        {onView ? (
          <Pressable
            onPress={() => onView(appointment)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${appointment.resident?.fullname ?? "this patient"}`}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center"
            style={{ borderRadius: QUEUE_RADIUS.control, borderWidth: 1, borderColor: palette.panelBorder }}
          >
            <Feather name="eye" size={16} color={palette.muted} />
          </Pressable>
        ) : null}

        {canComplete ? (
          <Pressable
            onPress={() => !busy && onComplete(appointment)}
            disabled={busy}
            accessibilityRole="button"
            accessibilityState={{ disabled: busy }}
            accessibilityLabel={`Complete appointment for ${appointment.resident?.fullname ?? "this patient"}`}
            className="h-9 flex-row items-center justify-center gap-1.5 px-3.5"
            style={{
              borderRadius: QUEUE_RADIUS.control,
              backgroundColor: palette.primary,
              opacity: busy ? 0.55 : 1,
            }}
          >
            {busy ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="check" size={15} color="#FFFFFF" />
            )}
            <Text className="text-[13px] font-semibold text-white">Complete</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default QueueRow;
