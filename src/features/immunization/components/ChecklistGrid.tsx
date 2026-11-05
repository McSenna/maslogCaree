import { formatCalendarDay } from "@/features/medicalRecordMasterlist/masterlistLabels";
import { Platform, Text, View } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { BREAKPOINTS } from "@/theme/breakpoints";
import type { Checklist, DoseView } from "../types";
import DoseCell from "./DoseCell";
import VaccineHeading from "./VaccineHeading";
import useChecklistGridStyles from "./checklistGridStyles";
import useImmunizationStyles from "./immunizationStyles";

export default function ChecklistGrid({
  checklist,
  readOnly,
  disabled = false,
  ageGroupHeader = true,
  hoverPreview = true,
  gridFrom = BREAKPOINTS.xl,
  onSelect,
}: {
  checklist: Checklist;
  readOnly: boolean;
  disabled?: boolean;
  ageGroupHeader?: boolean;
  hoverPreview?: boolean;
  /** Window width where the grid replaces stacked cards. A wide dialog has room sooner than the page does. */
  gridFrom?: number;
  onSelect: (dose: DoseView) => void;
}) {
  const { styles } = useImmunizationStyles();
  const grid = useChecklistGridStyles();
  const { width } = useResponsive();
  const { schedule, doses } = checklist;
  const cell = (dose: DoseView) => (
    <DoseCell
      key={dose.key}
      dose={dose}
      vaccine={
        schedule.vaccines.find((item) => item.key === dose.vaccineKey)?.name ??
        dose.vaccineKey
      }
      age={
        schedule.slots.find((item) => item.key === dose.slot)?.label ??
        dose.slot
      }
      readOnly={readOnly}
      disabled={disabled}
      centered={width >= gridFrom}
      hoverPreview={hoverPreview}
      onSelect={onSelect}
    />
  );
  if (width < gridFrom)
    return (
      <View style={styles.section}>
        {schedule.vaccines.map((vaccine) => (
          <View key={vaccine.key} style={styles.panel}>
            <VaccineHeading vaccine={vaccine} />
            {doses
              .filter((dose) => dose.vaccineKey === vaccine.key)
              .map((dose) => (
                <View key={dose.key} style={grid.mobileDose}>
                  <View style={grid.age}>
                    <Text style={styles.strong}>
                      {
                        schedule.slots.find((slot) => slot.key === dose.slot)
                          ?.label
                      }
                    </Text>
                    <Text style={styles.muted}>
                      Target: {dose.targetOn ? formatCalendarDay(dose.targetOn) : "Not set"}
                    </Text>
                  </View>
                  <View style={grid.mobileControl}>{cell(dose)}</View>
                </View>
              ))}
          </View>
        ))}
      </View>
    );
  return (
    <View role={Platform.OS === "web" ? "table" : undefined}
      accessibilityLabel="Infant immunization checklist" style={grid.table}>
      {ageGroupHeader ? (
        <View role={Platform.OS === "web" ? "row" : undefined} style={[grid.row, grid.header]}>
          <View role={Platform.OS === "web" ? "columnheader" : undefined} style={grid.vaccine}>
            <Text accessibilityRole="header" style={styles.strong}>
              BAKUNA
            </Text>
          </View>
          <View role={Platform.OS === "web" ? "columnheader" : undefined} aria-colspan={6} style={grid.group}>
            <Text accessibilityRole="header" style={styles.strong}>
              NIREREKOMENDANG EDAD NG BATA
            </Text>
          </View>
        </View>
      ) : null}
      <View role={Platform.OS === "web" ? "row" : undefined} style={[grid.row, grid.header]}>
        <View role={Platform.OS === "web" ? "columnheader" : undefined} style={grid.vaccine}>
          <Text style={styles.muted}>
            Vaccine information: disease and route
          </Text>
        </View>
        {schedule.slots.map((slot) => (
          <View role={Platform.OS === "web" ? "columnheader" : undefined} key={slot.key} style={grid.slot}>
            <Text accessibilityRole="header" style={[styles.strong, grid.slotTitle]}>
              {slot.label}
            </Text>
          </View>
        ))}
      </View>
      {schedule.vaccines.map((vaccine) => (
        <View role={Platform.OS === "web" ? "row" : undefined} key={vaccine.key} style={grid.row}>
          <View role={Platform.OS === "web" ? "rowheader" : undefined} style={grid.vaccine}>
            <VaccineHeading vaccine={vaccine} />
          </View>
          {schedule.slots.map((slot) => (
            <View role={Platform.OS === "web" ? "cell" : undefined} key={slot.key} style={grid.slot}>
              {doses
                .filter(
                  (dose) =>
                    dose.vaccineKey === vaccine.key && dose.slot === slot.key,
                )
                .map(cell)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
