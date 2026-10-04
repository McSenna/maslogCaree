import { View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { MedicalRecord } from "@/services/medicalRecords";

import { formatDate, shortReference } from "../recordFormat";
import { DetailSection, KeyValueRow } from "./DetailSection";

type Props = { palette: ResidentDialogPalette; record: MedicalRecord; serviceLabel: string };

/** In place of appointment details: a record the health center had on file before it was added here. */
export const HistoricalVisitSection = ({ palette, record, serviceLabel }: Props) => {
  const rows = [
    { label: "Service", value: serviceLabel },
    { label: "Visit date", value: formatDate(record.completedAt) },
    { label: "Source", value: "From barangay health center records" },
    { label: "Reason for visit", value: record.visitReason ?? "" },
    { label: "Reference", value: shortReference("REC", record._id) },
  ].filter((row) => row.value);

  return (
    <DetailSection palette={palette} title="Visit Information" icon="archive">
      <View className="gap-2">
        {rows.map((row) => (
          <KeyValueRow key={row.label} palette={palette} label={row.label} value={row.value} />
        ))}
      </View>
    </DetailSection>
  );
};

export default HistoricalVisitSection;
