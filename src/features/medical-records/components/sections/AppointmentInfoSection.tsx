import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";
import type { MedicalRecord } from "@/services/medicalRecords";

import { formatDateTime, shortReference } from "../recordFormat";
import DetailSection, { KeyValueRow } from "./DetailSection";
import { View } from "react-native";

type Props = {
  palette: ResidentDialogPalette;
  record: MedicalRecord;
  serviceLabel: string;
  appointment: AppointmentRecord | null;
};

const linkedAppointment = (
  record: MedicalRecord,
  fallback: AppointmentRecord | null
): Partial<AppointmentRecord> | null => {
  if (record.appointment && typeof record.appointment === "object") return record.appointment;
  return fallback;
};

export const AppointmentInfoSection = ({
  palette,
  record,
  serviceLabel,
  appointment,
}: Props) => {
  const linked = linkedAppointment(record, appointment);
  const visitedAt = record.appointmentDate ?? linked?.slotStart ?? null;

  const rows = [
    { label: "Service", value: serviceLabel },
    { label: "Visit date", value: visitedAt ? formatDateTime(visitedAt) : "" },
    { label: "Recorded", value: formatDateTime(record.completedAt) },
    { label: "Reference", value: shortReference("REC", record._id) },
  ].filter((row) => row.value);

  return (
    <DetailSection palette={palette} title="Appointment Information" icon="info">
      <View style={{ gap: 8 }}>
        {rows.map((row) => (
          <KeyValueRow key={row.label} palette={palette} label={row.label} value={row.value} />
        ))}
      </View>
    </DetailSection>
  );
};

export default AppointmentInfoSection;
