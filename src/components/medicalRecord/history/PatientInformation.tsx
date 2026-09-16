import { View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalRecord } from "@/services/medicalRecords";
import { formatDate } from "@/utils/dateFormatter";
import { DetailRow, RecordSection } from "@/components/ui/DetailSection";
import { ageFrom, formatSex, patientIdOf } from "./recordPresenter";

const PatientInformation = ({
  record,
  palette,
}: {
  record: MedicalRecord;
  palette: QueuePalette;
}) => {
  const resident = typeof record.resident === "object" ? record.resident : null;
  const age = ageFrom(resident?.dateOfBirth);
  const sex = formatSex((resident as { gender?: string } | null)?.gender);

  const rows = [
    { label: "Patient", value: resident?.fullname ?? "" },
    { label: "Patient ID", value: patientIdOf(resident?._id) },
    { label: "Age", value: age === null ? "" : `${age} years old` },
    { label: "Sex", value: sex },
    { label: "Date of service", value: formatDate(record.appointmentDate ?? record.completedAt) },
  ].filter((row) => row.value && row.value !== "—");

  if (!rows.length) return null;

  return (
    <RecordSection title="Patient Information" palette={palette}>
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

export default PatientInformation;
