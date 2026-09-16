import { View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { AppointmentRecord } from "@/services/appointments";
import type { MedicalRecord } from "@/services/medicalRecords";
import { formatDateTime } from "@/utils/dateFormatter";
import { DetailRow, RecordSection } from "@/components/ui/DetailSection";
import { serviceLabelOf } from "./recordPresenter";

const whenText = (value: string | null | undefined): string => {
  if (!value) return "";
  const { date, time } = formatDateTime(value);
  return time ? `${date} • ${time}` : date;
};

const AppointmentInformation = ({
  record,
  palette,
}: {
  record: MedicalRecord;
  palette: QueuePalette;
}) => {
  const appointment: (Partial<AppointmentRecord> & { _id?: string }) | null =
    typeof record.appointment === "object" && record.appointment ? record.appointment : null;

  const appointmentId =
    appointment?._id ?? (typeof record.appointment === "string" ? record.appointment : "");

  const rows = [
    {
      label: "Reference no.",
      value: appointmentId ? `APT-${String(appointmentId).slice(-8).toUpperCase()}` : "",
    },
    { label: "Service", value: serviceLabelOf(record) },
    {
      label: "Appointment",
      value: whenText(record.appointmentDate ?? appointment?.slotStart),
    },
    { label: "Completed", value: whenText(record.completedAt) },
    { label: "Status", value: appointment?.status === "completed" ? "Completed" : "" },
  ].filter((row) => row.value);

  if (!rows.length) return null;

  return (
    <RecordSection title="Appointment Information" palette={palette}>
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

export default AppointmentInformation;
