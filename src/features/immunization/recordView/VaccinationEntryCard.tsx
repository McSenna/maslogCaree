import { forwardRef } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { Badge } from "@/components/data-table";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { Row } from "@/components/medicalRecord/details/RecordPrimitives";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { RADII } from "@/theme/radius";
import { TYPE } from "@/theme/typography";

import { STATUS_BADGES } from "./vaccinationBadges";
import type { VaccinationEntry } from "./vaccinationTypes";

type Props = {
  entry: VaccinationEntry;
  /** Reached through View Details; the border says which of several doses it is. */
  targeted: boolean;
  onLayout: (event: LayoutChangeEvent) => void;
  /** Editing only: opens this dose in the dose modal. */
  onOpen?: () => void;
};

const dateLine = (entry: VaccinationEntry): string => {
  if (!entry.administered) return entry.dateLabel;
  return entry.dateLabel === "Not recorded" ? "Administered, date not recorded" : `Administered ${entry.dateLabel}`;
};

/** One dose. Vaccine, dose and date lead, so repeated doses of a vaccine stay easy to tell apart. */
const VaccinationEntryCard = forwardRef<View, Props>(({ entry, targeted, onLayout, onOpen }, ref) => {
  const palette = useQueuePalette();
  const buttons = useAdminSurfacePalette();
  return (
    <View
      ref={ref}
      tabIndex={-1}
      accessible={false}
      onLayout={onLayout}
      testID={`vaccination-entry-${entry.id}`}
      style={[
        styles.card,
        { backgroundColor: palette.panelBg, borderColor: targeted ? palette.primary : palette.panelBorder },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titles}>
          <Text accessibilityRole="header" style={[styles.title, { color: palette.heading }]}>
            {entry.vaccineName}, {entry.doseLabel}
          </Text>
          <Text style={[styles.date, { color: palette.body }]}>{dateLine(entry)}</Text>
        </View>
        <Badge size="md" spokenAs="Status" {...STATUS_BADGES[entry.status]} />
      </View>
      {entry.note ? <Text style={[styles.date, { color: palette.body }]}>{entry.note}</Text> : null}
      <View style={styles.fields}>
        {entry.fields.map((field) => (
          <View key={field.label} style={field.long ? styles.longField : styles.field}>
            <Row label={field.label} value={field.value} palette={palette} />
          </View>
        ))}
      </View>
      {onOpen ? (
        <View style={styles.action}>
          <DashboardButton palette={buttons} size="sm" variant="secondary" icon="edit-2" label="Open dose" accessibilityLabel={`Open dose: ${entry.vaccineName}, ${entry.doseLabel}`} onPress={onOpen} />
        </View>
      ) : null}
    </View>
  );
});
VaccinationEntryCard.displayName = "VaccinationEntryCard";

const styles = StyleSheet.create({
  card: { gap: 8, padding: 16, borderWidth: 1, borderRadius: RADII.large },
  header: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
  titles: { flexGrow: 1, flexShrink: 1, flexBasis: 200, minWidth: 0, gap: 4 },
  title: { ...TYPE.bodyStrong },
  date: { ...TYPE.caption },
  fields: { flexDirection: "row", flexWrap: "wrap", columnGap: 24 },
  field: { flexGrow: 1, flexShrink: 1, flexBasis: 340, minWidth: 0 },
  action: { alignItems: "flex-start", paddingTop: 4 },
  longField: { flexBasis: "100%", minWidth: 0 },
});

export default VaccinationEntryCard;
