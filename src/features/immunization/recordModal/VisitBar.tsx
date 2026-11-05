import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Badge, type BadgeColors, type BadgeTone } from "@/components/data-table";

import useRecordModalStyles from "./recordModalStyles";
import { formatRecordDate, progressOf } from "./recordModel";
import type { ImmunizationRecord, ProgressStatus } from "./types";

const ICON_SIZE = 18;

const PILL_ICONS = { not_started: "circle", in_progress: "clock", complete: "check-circle" } as const;

const ProgressPill = ({ status, label }: { status: ProgressStatus; label: string }) => {
  const { colors } = useRecordModalStyles();
  const tones: Record<ProgressStatus, BadgeTone | BadgeColors> = {
    not_started: "neutral",
    in_progress: { bg: colors.primarySoft, fg: colors.primary },
    complete: "success",
  };
  return <Badge size="md" tone={tones[status]} label={label} icon={PILL_ICONS[status]} spokenAs="Vaccination progress" />;
};

type VisitBarProps = {
  record: ImmunizationRecord;
  /** The two parts sit one above the other on narrow screens, without the rule between them. */
  stacked: boolean;
};

const VisitBar = ({ record, stacked }: VisitBarProps) => {
  const { colors, styles } = useRecordModalStyles();
  const { visit, vaccines } = record;
  const progress = progressOf(vaccines);
  const details = [formatRecordDate(visit.date), visit.provider, visit.type, visit.source].join(" · ");
  return (
    <View style={styles.visitBar}>
      <View style={styles.visitPart}>
        <Feather name="calendar" size={ICON_SIZE} color={colors.muted} />
        <Text style={styles.visitText}>
          <Text style={styles.visitLabel}>Visit: </Text>
          {details}
        </Text>
      </View>
      <View style={[styles.visitPart, !stacked && styles.visitProgress]}>
        <Text style={styles.visitLabel}>Vaccination progress:</Text>
        <ProgressPill status={progress.status} label={progress.statusLabel} />
        <Text style={styles.visitText}>{progress.summary}</Text>
      </View>
    </View>
  );
};

export default VisitBar;
