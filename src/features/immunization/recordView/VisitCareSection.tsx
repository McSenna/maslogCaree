import { StyleSheet, Text, View } from "react-native";

import { DataTable, type Column } from "@/components/data-table";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { TYPE } from "@/theme/typography";

import { formatCalendarDay } from "../../medicalRecordMasterlist/masterlistLabels";
import type { VaccinationRecordState } from "./useVaccinationRecord";
import type { VaccinationEntry } from "./vaccinationTypes";

type Props = { view: VaccinationRecordState; columns: Column<VaccinationEntry>[] };

/** What this one visit documented, kept apart from the baby's complete history below it. */
const VisitCareSection = ({ view, columns }: Props) => {
  const palette = useAdminSurfacePalette();
  if (!view.visit) return null;
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={[styles.title, { color: palette.heading }]}>
          Care documented at this visit
        </Text>
        <Text style={[styles.note, { color: palette.body }]}>{formatCalendarDay(view.visit.day)}</Text>
      </View>
      <DataTable
        caption="Care documented at this visit"
        columns={columns}
        data={view.visit.entries}
        rowKey={(entry) => entry.id}
        emptyIcon="calendar"
        emptyTitle="No doses match this visit's date"
        emptyDescription="A later correction may have moved a dose to another date. The baby's full record is below."
      />
      {view.programOpen ? (
        <Text style={[styles.note, { color: palette.body }]}>
          This visit is complete. The immunization program continues until every scheduled dose is administered.
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { gap: 8, paddingBottom: 16 },
  heading: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", columnGap: 12, rowGap: 4 },
  title: { ...TYPE.bodyStrong, fontWeight: "700" },
  note: { ...TYPE.caption },
});

export default VisitCareSection;
