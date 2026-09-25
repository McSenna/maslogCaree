import { useState } from "react";
import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";
import { useResponsive } from "@/hooks/useResponsive";

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
  const patientName = appointment.resident?.fullname || "this patient";
  const { isMobile } = useResponsive();

  const actions =
    onView || canComplete ? (
      <View className="flex-row items-center gap-2" style={isMobile ? { marginLeft: 56 } : undefined}>
        {onView ? (
          <IconButton
            icon="eye"
            variant="outline"
            size={36}
            label={`View details for ${patientName}`}
            onPress={() => onView(appointment)}
          />
        ) : null}

        {canComplete ? (
          <Button
            size="sm"
            icon="check"
            label="Complete"
            loading={busy}
            accessibilityLabel={`Complete appointment for ${patientName}`}
            onPress={() => onComplete(appointment)}
          />
        ) : null}
      </View>
    ) : null;

  return (
    <View
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`w-full px-4 py-3 ${isMobile ? "gap-2.5" : "flex-row items-center gap-3"}`}
      style={{
        backgroundColor: hovered ? palette.rowHover : "transparent",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <View className={`min-w-0 flex-row items-center gap-3 ${isMobile ? "" : "flex-1"}`}>
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
            {isServing ? <AppointmentStatusBadge status="processing" /> : null}
          </View>
          <Text numberOfLines={1} className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
            {serviceLabel} · {time}
          </Text>
        </View>
      </View>

      {actions}
    </View>
  );
};

export default QueueRow;
