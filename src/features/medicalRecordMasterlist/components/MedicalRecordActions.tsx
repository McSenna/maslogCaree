import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { TableButton } from "@/components/data-table";
import { TablePlacementContext, type TablePlacement } from "@/components/data-table/TablePlacement";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { formatVisitDate } from "../masterlistLabels";
import { mayDeleteRecord } from "../recordDeletionAccess";
import type { MasterlistRow } from "../types";
import { residentNameOf } from "./rowText";

export type MedicalRecordActionHandlers = {
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (row: MasterlistRow) => void;
  editLoadingId?: string | null;
  deleteLoadingId?: string | null;
};
type Props = MedicalRecordActionHandlers & {row:MasterlistRow;placement?:TablePlacement};

// Native controls use their spoken names; web also gets the browser's hover hint.
const IconHint = ({ label, children }: {label:string;children:ReactNode}) =>
  Platform.OS === "web" ? <div title={label}>{children}</div> : <>{children}</>;

const MedicalRecordActions = ({ row, onView, onEdit, onDelete, editLoadingId, deleteLoadingId, placement = "table" }: Props) => {
  const colors = useThemeColors();
  const { user } = useAuth();
  const onCard = placement === "card";
  const name = residentNameOf(row);
  const visit = formatVisitDate(row.source, row.visitDate);
  const busy = Boolean(editLoadingId || deleteLoadingId);

  return (
    <TablePlacementContext.Provider value={placement}>
      <View role="group" accessibilityLabel="Medical record actions"
        style={[styles.row, onCard && styles.card, onCard && { borderTopColor: colors.divider }]}>
        <IconHint label="View record">
          <TableButton size="comfortable" icon="eye" label="View"
            disabled={busy}
            accessibilityLabel={`View the ${row.serviceLabel} record for ${name}, ${visit}`}
            onPress={() => onView(row._id)} />
        </IconHint>
        {row.baby && user?.role === "midwife" && onEdit ? (
          <IconHint label="Edit record">
            <TableButton iconOnly size="comfortable" variant="text" icon="edit-2" label="Edit"
              accessibilityLabel={`Edit immunization record for ${name}`}
              loading={editLoadingId === row._id} disabled={busy}
              onPress={() => onEdit(row._id)} />
          </IconHint>
        ) : null}
        {onDelete && mayDeleteRecord(row, user) ? (
          <IconHint label="Delete record">
            <TableButton iconOnly size="comfortable" variant="outlined" tone="danger" icon="trash-2" label="Delete"
              accessibilityLabel={`Delete ${row.serviceLabel} record for ${name}, ${visit}`}
              loading={deleteLoadingId === row._id} disabled={busy}
              onPress={() => onDelete(row)} />
          </IconHint>
        ) : null}
      </View>
    </TablePlacementContext.Provider>
  );
};
const styles = StyleSheet.create({
  row: {flexDirection:"row",alignItems:"center",justifyContent:"flex-end",gap:SPACING.sm},
  card: {width:"100%",borderTopWidth:1,paddingTop:SPACING.md,marginTop:SPACING.xs},
});
export default MedicalRecordActions;
