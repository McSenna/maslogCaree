import { StyleSheet, View } from "react-native";

import { TableButton, TablePrimaryCell, type Column } from "@/components/data-table";
import { useTablePlacement } from "@/components/data-table/TablePlacement";
import { getServiceLabel } from "@/config/appointmentServices";
import { SourcePill } from "@/features/medicalRecordMasterlist/components/MasterlistPills";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { MedicalRecord } from "@/services/medicalRecords";
import { SPACING } from "@/theme/spacing";

import { babyNameOf, isBabyPreview, providerNameOf, visitDateOf } from "../residentRecordRows";

const serviceLabelOf = (record: MedicalRecord) => getServiceLabel(record.serviceType) || record.serviceType;

// The name comes first, so a narrow column only ever cuts the count. The record has the full status.
const serviceDetailOf = (record: MedicalRecord) => {
  const baby = babyNameOf(record);
  if (!baby) return "";
  const counts = record.immunizationProgress;
  return counts ? `Baby: ${baby}, ${counts.administered} of ${counts.total} doses` : `Baby: ${baby}`;
};

const ViewAction = ({ record, onView }: { record: MedicalRecord; onView: (record: MedicalRecord) => void }) => {
  const colors = useThemeColors();
  const onCard = useTablePlacement() === "card";
  const baby = babyNameOf(record);
  const about = baby ? `${serviceLabelOf(record)} record for ${baby}` : `${serviceLabelOf(record)} record`;

  return (
    <View style={[styles.row, onCard && styles.card, onCard && { borderTopColor: colors.divider }]}>
      <TableButton
        size="comfortable"
        icon="eye"
        label="View"
        accessibilityLabel={`View the ${about}, ${visitDateOf(record)}`}
        onPress={() => onView(record)}
      />
    </View>
  );
};

/** The staff table's columns, minus the resident and account ones: every row here is this person's own. */
export const residentRecordColumns = (onView: (record: MedicalRecord) => void): Column<MedicalRecord>[] => [
  {
    key: "service",
    nameColumn: true,
    header: "Service",
    flex: 1.4,
    minWidth: 220,
    render: (row) => <TablePrimaryCell title={serviceLabelOf(row)} detail={serviceDetailOf(row)} />,
  },
  { key: "visit", header: "Visit date", align: "center", width: 150, accessor: visitDateOf },
  { key: "provider", header: "Provider", flex: 1, minWidth: 160, hideBelow: "lg", accessor: providerNameOf },
  {
    key: "source",
    header: "Source",
    align: "center",
    width: 168,
    hideBelow: "lg",
    cardRole: "badge",
    render: (row) => (isBabyPreview(row) ? null : <SourcePill source={row.source ?? "appointment"} />),
  },
  {
    key: "actions",
    header: "Actions",
    width: 120,
    align: "center",
    cardRole: "actions",
    render: (row) => <ViewAction record={row} onView={onView} />,
  },
];

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: SPACING.sm },
  card: {
    width: "100%",
    borderTopWidth: 1,
    paddingTop: SPACING.md,
    marginTop: SPACING.xs,
  },
});
