import { View } from "react-native";
import type { MedicalRecord } from "@/services/medicalRecords";
import MedicalRecordCard from "../cards/MedicalRecordCard";
import ProfileTabState from "../common/ProfileTabState";

type MedicalRecordsTabProps = {
  records: MedicalRecord[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  twoColumn: boolean;
};

const MedicalRecordsTab = ({
  records,
  loading,
  error,
  onRetry,
  twoColumn,
}: MedicalRecordsTabProps) => {
  if (loading || error || records.length === 0) {
    return (
      <ProfileTabState
        loading={loading}
        error={error}
        isEmpty={records.length === 0}
        emptyIcon="file-text"
        emptyTitle="No medical records available"
        emptyBody="Records are added by your healthcare provider after a completed service."
        onRetry={onRetry}
      />
    );
  }

  return (
    <View
      style={{
        flexDirection: twoColumn ? "row" : "column",
        flexWrap: twoColumn ? "wrap" : "nowrap",
        gap: 12,
      }}
    >
      {records.map((record) => (
        <View key={record._id} style={{ width: twoColumn ? "48.6%" : "100%", minWidth: 0 }}>
          <MedicalRecordCard record={record} />
        </View>
      ))}
    </View>
  );
};

export default MedicalRecordsTab;
