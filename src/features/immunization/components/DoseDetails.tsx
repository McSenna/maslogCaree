import { View } from "react-native";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { SectionCard } from "@/components/medicalRecord/complete/SectionCard";
import { formatClock } from "@/components/medicalRecord/fields/clockFormat";
import FocusableRegion from "@/components/ui/FocusableRegion";
import { Row } from "@/components/medicalRecord/details/RecordPrimitives";
import { formatCalendarDay } from "@/features/medicalRecordMasterlist/masterlistLabels";
import type { Checklist, DoseView } from "../types";
import DoseAudit from "./DoseAudit";
import { DoseFacts, DoseSchedule } from "./DoseIdentity";
import useImmunizationStyles from "./immunizationStyles";

type Props = { checklist: Checklist; dose: DoseView };

/** The modal's read-first body: looking at a saved dose can never start an edit. */
const DoseDetails = ({ checklist, dose }: Props) => {
  const { styles } = useImmunizationStyles();
  const palette = useQueuePalette();
  const record = dose.record;
  if (!record) return null;
  const blank = record.workflowStatus === "draft" ? "Not yet recorded (draft)" : "Not recorded";
  const rows = (fields: (readonly [string, string | undefined])[]) =>
    fields.map(([label, value]) => (
      <View key={label} style={styles.detailField}>
        <Row label={label} value={value || blank} palette={palette} />
      </View>
    ));
  return (
    <FocusableRegion accessibilityLabel="Saved dose details">
      <View style={styles.section}>
      <SectionCard icon="shield" title="Vaccination Information">
        <DoseFacts checklist={checklist} dose={dose} />
        <View style={styles.detailFields}>
          {rows([
            ["Actual administration date", record.administeredOn ? formatCalendarDay(record.administeredOn) : ""],
            ["Administration time", formatClock(record.administeredAt)],
          ])}
        </View>
        <DoseSchedule dose={dose} />
      </SectionCard>
      <SectionCard icon="clipboard" title="Administration Details">
        <View style={styles.detailFields}>
          {rows([
            ["Clinician", record.administeredBy],
            ["Location", record.facility],
            // No longer entered by hand, so each appears only when the dose has one.
            ...(record.lotNumber ? ([["Batch / lot number", record.lotNumber]] as const) : []),
            ...(record.route ? ([["Recorded route", record.route]] as const) : []),
            ...(record.site ? ([["Site", record.site]] as const) : []),
          ])}
        </View>
      </SectionCard>
      <SectionCard icon="file-text" title="Additional Information">
        <View style={styles.detailFields}>
          {rows([
            ["Remarks", record.remarks],
            ["Immediate reaction", record.immediateReaction],
            ["Adverse event (AEFI)", record.aefi],
            ["Reason / deferral", record.reason],
            ["Historical documentation", record.historical ? "Yes" : "No"],
          ])}
        </View>
      </SectionCard>
      {record.history.length ? <DoseAudit record={record} /> : null}
      </View>
    </FocusableRegion>
  );
};
export default DoseDetails;
