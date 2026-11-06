import { useState } from "react";
import { View } from "react-native";

import { DialogStatus } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

import { formatDateKey, shiftMonth } from "../../regularSchedule/scheduleFormat";
import { canGoToNextMonth, canGoToPreviousMonth, timeFieldText } from "../../regularSchedule/scheduleRules";
import type { RegularSchedulePicker } from "../../regularSchedule/useRegularSchedule";
import { PickerField } from "./PickerField";
import { PickerSheet } from "./PickerSheet";
import { PickerLoadError, RegularTimeArea } from "./RegularTimeArea";
import { ScheduleHoursNote } from "./ScheduleHoursNote";
import { ServiceCalendar } from "./ServiceCalendar";

type Props = {
  palette: ResidentDialogPalette;
  serviceLabel: string;
  picker: RegularSchedulePicker;
  /** Called after any date or time choice, so the form can clear its error. */
  onChange: () => void;
  hasError?: boolean;
  /** The booking form shows the hours in its sidebar instead. */
  showHours?: boolean;
};

type OpenPicker = "date" | "time" | null;

/**
 * Date and time for a regular-schedule service (BP checking) as two boxes.
 * The Date box opens the calendar; choosing a date closes it and opens the
 * times for that date straight away. The Time box reopens those times. Every
 * value comes from the server, which re-checks the chosen time on save.
 */
export const RegularScheduleField = ({ palette, serviceLabel, picker, onChange, hasError = false, showHours = true }: Props) => {
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const { schedule, month } = picker;

  if (!schedule || !month) {
    if (picker.error) return <PickerLoadError palette={palette} picker={picker} />;
    return <DialogStatus palette={palette} message="Loading open dates..." />;
  }

  const time = timeFieldText(picker);
  const dateText = picker.dateKey ? formatDateKey(picker.dateKey) : null;

  return (
    <View className="gap-4">
      {showHours ? <ScheduleHoursNote palette={palette} serviceLabel={serviceLabel} schedule={schedule} /> : null}

      <View className="flex-row flex-wrap gap-4">
      <PickerField
        palette={palette}
        label="Date"
        required
        icon="calendar-month-outline"
        value={dateText}
        placeholder="Choose a date"
        hint="Opens a calendar of open dates"
        open={openPicker === "date"}
        hasError={hasError && !picker.dateKey}
        onPress={() => setOpenPicker("date")}
      />
      <PickerField
        palette={palette}
        label="Time"
        required
        icon="clock-outline"
        value={time.value}
        placeholder={time.placeholder}
        hint="Opens the open times for the chosen date"
        open={openPicker === "time"}
        disabled={time.disabled}
        loading={picker.dayLoading}
        hasError={hasError && Boolean(picker.dateKey) && !picker.slotStart}
        onPress={() => setOpenPicker("time")}
      />
      </View>

      <PickerSheet palette={palette} visible={openPicker === "date"} title="Choose a date" subtitle={`${serviceLabel} is open on dates with a dot.`} desktopWidth={460} onClose={() => setOpenPicker(null)}>
        <ServiceCalendar
          palette={palette}
          monthKey={month.monthKey}
          days={month.days}
          todayKey={schedule.today}
          selectedDateKey={picker.dateKey}
          loading={picker.monthLoading}
          canGoBack={canGoToPreviousMonth(month.monthKey, schedule.today)}
          canGoForward={canGoToNextMonth(month.monthKey, schedule.lastBookableDate)}
          onPrevious={() => picker.goToMonth(shiftMonth(month.monthKey, -1))}
          onNext={() => picker.goToMonth(shiftMonth(month.monthKey, 1))}
          onSelect={(dateKey) => {
            picker.selectDate(dateKey);
            onChange();
            setOpenPicker("time");
          }}
        />
      </PickerSheet>

      <PickerSheet palette={palette} visible={openPicker === "time"} title="Choose a time" subtitle={dateText} desktopWidth={520} onClose={() => setOpenPicker(null)}>
        <RegularTimeArea
          palette={palette}
          serviceLabel={serviceLabel}
          picker={picker}
          onPicked={(start) => {
            picker.selectSlot(start);
            onChange();
            setOpenPicker(null);
          }}
          onChangeDate={() => setOpenPicker("date")}
        />
      </PickerSheet>
    </View>
  );
};

export default RegularScheduleField;
