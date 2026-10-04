import { Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { Block, Row, formatWhen } from "@/components/medicalRecord/details/RecordPrimitives";

import { ROLE_LABELS } from "../../masterlistLabels";
import { changedFieldLabel, previousValueText } from "../../revisionLabels";
import type { MasterlistDetail } from "../../types";

const byLine = (person: { fullname: string } | null, role: keyof typeof ROLE_LABELS | null) =>
  [person?.fullname, role ? ROLE_LABELS[role] : ""].filter(Boolean).join(", ") || "Not recorded";

/** Who encoded and last changed the record, and every earlier value an edit replaced. */
const RecordHistoryBlock = ({ detail }: { detail: MasterlistDetail }) => {
  const palette = useQueuePalette();
  const { audit, revisions, form } = detail;
  const muted = { color: palette.muted };
  const heading = { color: palette.heading };

  return (
    <Block title="Record history" palette={palette}>
      <Row label="Encoded by" value={byLine(audit.createdBy, audit.createdByRole)} palette={palette} />
      <Row label="Encoded on" value={formatWhen(audit.createdAt)} palette={palette} />
      {revisions.length > 0 ? <Row label="Last changed" value={formatWhen(audit.updatedAt)} palette={palette} /> : null}
      {audit.duplicateAcknowledged ? (
        <Row label="Duplicate check" value="Saved after a possible-duplicate warning" palette={palette} />
      ) : null}
      {revisions.map((revision, index) => (
        <View key={`${revision.editedAt}-${index}`} className="gap-1 border-t py-2.5" style={{ borderColor: palette.divider }}>
          <Text className="text-[12.5px] font-semibold" style={heading}>
            {`Changed ${formatWhen(revision.editedAt)} by ${byLine(revision.editedBy, revision.editedByRole)}`}
          </Text>
          <Text className="text-[12.5px]" style={muted}>{`Reason: ${revision.reason}`}</Text>
          {revision.changes.map((change) => (
            <Text key={change.field} className="text-[12.5px]" style={muted}>
              {`${changedFieldLabel(change.field, form)} was ${previousValueText(change.field, change.previous)}`}
            </Text>
          ))}
        </View>
      ))}
    </Block>
  );
};

export default RecordHistoryBlock;
