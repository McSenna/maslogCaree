import { View } from "react-native";
import { SPACING } from "@/theme/spacing";
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

const GUTTER = SPACING.md;

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
        marginHorizontal: twoColumn ? -GUTTER / 2 : 0,
        rowGap: GUTTER,
      }}
    >
      {records.map((record) => (
        <View key={record._id} style={{ width: twoColumn ? "50%" : "100%", minWidth: 0, paddingHorizontal: twoColumn ? GUTTER / 2 : 0 }}>
          <MedicalRecordCard record={record} />
        </View>
      ))}
    </View>
  );
};

export default MedicalRecordsTab;
