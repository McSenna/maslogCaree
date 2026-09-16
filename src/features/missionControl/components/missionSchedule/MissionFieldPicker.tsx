import { useState } from "react";
import type { MissionFormField, MissionFormValues } from "../../hooks/useMissionForm";
import { formatClockLabel, formatLongDateLabel } from "../../utils/dateTime";
import MissionCalendar from "./MissionCalendar";
import MissionPickerModal from "./MissionPickerModal";
import MissionTimeWheel, {
  formatTimeParts,
  parseTimeParts,
  type TimeParts,
} from "./MissionTimeWheel";

type MissionFieldPickerProps = {
  field: MissionFormField | null;
  values: MissionFormValues;
  onChange: (field: MissionFormField, next: string) => void;
  onDismiss: () => void;
};

const TITLES: Record<MissionFormField, string> = {
  date: "Mission date",
  start: "Start time",
  end: "End time",
};

const MissionFieldPicker = ({
  field,
  values,
  onChange,
  onDismiss,
}: MissionFieldPickerProps) => {
  if (!field) return null;

  const committed =
    field === "date"
      ? values.date
      : field === "start"
        ? values.startTime
        : values.endTime;

  return (
    <MissionPickerBody
      key={field}
      field={field}
      committed={committed}
      onChange={onChange}
      onDismiss={onDismiss}
    />
  );
};

const MissionPickerBody = ({
  field,
  committed,
  onChange,
  onDismiss,
}: {
  field: MissionFormField;
  committed: string;
  onChange: (field: MissionFormField, next: string) => void;
  onDismiss: () => void;
}) => {
  const isDate = field === "date";

  const [draftDate, setDraftDate] = useState(committed);
  const [draftTime, setDraftTime] = useState<TimeParts>(() => parseTimeParts(committed));

  const handleConfirm = () => {
    onChange(field, isDate ? draftDate : formatTimeParts(draftTime));
    onDismiss();
  };

  return (
    <MissionPickerModal
      visible
      title={TITLES[field]}
      summary={
        isDate ? formatLongDateLabel(draftDate) : formatClockLabel(formatTimeParts(draftTime))
      }
      onCancel={onDismiss}
      onConfirm={handleConfirm}
    >
      {isDate ? (
        <MissionCalendar value={draftDate} onChange={setDraftDate} />
      ) : (
        <MissionTimeWheel parts={draftTime} onChange={setDraftTime} />
      )}
    </MissionPickerModal>
  );
};

export default MissionFieldPicker;
