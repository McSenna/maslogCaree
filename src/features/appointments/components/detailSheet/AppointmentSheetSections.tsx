import { Text, View } from "react-native";

import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { DetailRow, RecordSection } from "@/components/ui/DetailSection";
import type { AppointmentRecord } from "@/services/appointments";

type DetailRowData = { label: string; value: string };

export const AppointmentDetailRows = ({
  rows,
  palette,
}: {
  rows: DetailRowData[];
  palette: QueuePalette;
}) => {
  if (!rows.length) return null;

  return (
    <RecordSection title="Appointment Details" palette={palette}>
      <View className="w-full">
        {rows.map((row, index) => (
          <DetailRow
            key={row.label}
            label={row.label}
            value={row.value}
            palette={palette}
            last={index === rows.length - 1}
          />
        ))}
      </View>
    </RecordSection>
  );
};

export const ResidentNotesSection = ({
  appointment,
  palette,
}: {
  appointment: AppointmentRecord;
  palette: QueuePalette;
}) => {
  if (!appointment.description && !appointment.additionalNotes) return null;

  return (
    <RecordSection title="What You Told Us" palette={palette}>
      <View className="w-full">
        {appointment.description ? (
          <DetailRow
            label="Reason"
            value={appointment.description}
            palette={palette}
            stacked
            last={!appointment.additionalNotes}
          />
        ) : null}
        {appointment.additionalNotes ? (
          <DetailRow
            label="Additional notes"
            value={appointment.additionalNotes}
            palette={palette}
            stacked
            last
          />
        ) : null}
      </View>
    </RecordSection>
  );
};

const REASON_OF: Record<string, (a: AppointmentRecord) => string | undefined> = {
  declined: (a) => a.declineReason,
  cancelled: (a) => a.cancelReason,
};

export const DeclineReasonSection = ({
  appointment,
  palette,
}: {
  appointment: AppointmentRecord;
  palette: QueuePalette;
}) => {
  const reason = REASON_OF[appointment.status]?.(appointment)?.trim();
  if (!reason) return null;

  const tone =
    appointment.status === "cancelled" ? palette.statuses.cancelled : palette.statuses.declined;

  return (
    <View className="w-full gap-2">
      <Text
        className="text-[11.5px] font-bold uppercase"
        style={{ color: palette.subtle, letterSpacing: 0.6 }}
      >
        Reason
      </Text>
      <View
        className="w-full px-3.5 py-3"
        style={{ borderRadius: QUEUE_RADIUS.control, backgroundColor: tone.bg }}
      >
        <Text className="text-[13.5px] leading-[20px]" style={{ color: tone.fg }}>
          {reason}
        </Text>
      </View>
    </View>
  );
};
