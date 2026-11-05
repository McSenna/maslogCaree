import { Text, View } from "react-native";

import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

import type { AnnouncementFormState } from "../../hooks/useAnnouncementForm";
import AnnouncementDateTimeFields from "./AnnouncementDateTimeFields";
import AnnouncementEndDateField from "./AnnouncementEndDateField";
import AudienceRadioGroup from "./AudienceRadioGroup";
import { AUDIENCE_SCHEDULE_HELPER, SCHEDULE_HELPER } from "./formCopy";

type AudienceSchedulePanelProps = {
  form: AnnouncementFormState;
  compact: boolean;
  /** Date and time each need about 160px, so a narrow panel stacks them. */
  stackDateTime: boolean;
};

const PANEL_FLEX = { flex: 4, minWidth: 0 };

/** The right side of the editor: who it reaches, and the event it is about. */
const AudienceSchedulePanel = ({ form, compact, stackDateTime }: AudienceSchedulePanelProps) => {
  const palette = useResidentDialogPalette();
  const { values, errors, submitting, pickField, blurField, fieldRef, setField } = form;

  return (
    <View
      className={`gap-5 ${compact ? "border-t p-5" : "border-l p-6"}`}
      style={[compact ? null : PANEL_FLEX, { backgroundColor: palette.card, borderColor: palette.divider }]}
    >
      <View className="gap-1">
        <Text accessibilityRole="header" style={[TYPE.bodyStrong, { color: palette.heading }]}>
          Audience & schedule
        </Text>
        <Text style={[TYPE.body, { color: palette.muted }]}>{AUDIENCE_SCHEDULE_HELPER}</Text>
      </View>

      <AudienceRadioGroup value={values.audience} onChange={(audience) => setField("audience", audience)} disabled={submitting} />

      <View className="h-px" style={{ backgroundColor: palette.divider }} />

      <View className="gap-4">
        <View className="gap-1">
          <Text accessibilityRole="header" style={[TYPE.bodyStrong, { color: palette.heading }]}>
            Schedule
          </Text>
          <Text style={[TYPE.body, { color: palette.muted }]}>{SCHEDULE_HELPER}</Text>
        </View>
        <AnnouncementDateTimeFields
          date={values.date}
          time={values.time}
          onChangeDate={(value) => pickField("date", value)}
          onChangeTime={(value) => pickField("time", value)}
          onBlurDate={() => blurField("date")}
          onBlurTime={() => blurField("time")}
          dateInputRef={fieldRef("date")}
          timeInputRef={fieldRef("time")}
          dateError={errors.date}
          timeError={errors.time}
          disabled={submitting}
          stacked={stackDateTime}
        />
        <AnnouncementEndDateField
          value={values.endDate}
          eventDate={values.date}
          onChange={(value) => pickField("endDate", value)}
          onBlur={() => blurField("endDate")}
          inputRef={fieldRef("endDate")}
          error={errors.endDate}
          disabled={submitting}
        />
      </View>
    </View>
  );
};

export default AudienceSchedulePanel;
