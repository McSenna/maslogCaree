import { useState } from "react";
import { Text, View } from "react-native";

import { formatBirthDate } from "../../utils/dateOfBirth";
import { REG_COLORS } from "../../registration/registrationTheme";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";
import YearPicker from "./YearPicker";
import type { useDateOfBirthDraft } from "./useDateOfBirthDraft";

type DatePickerPanelProps = {
  draft: ReturnType<typeof useDateOfBirthDraft>;
  cellSize: number;
};

const DatePickerPanel = ({ draft, cellSize }: DatePickerPanelProps) => {
  const [yearsOpen, setYearsOpen] = useState(false);

  const handleSelectYear = (year: number) => {
    draft.selectYear(year);
    setYearsOpen(false);
  };

  return (
    <View style={{ gap: 14 }}>
      <CalendarHeader
        year={draft.year}
        monthIndex={draft.monthIndex}
        canGoForward={draft.canGoForward}
        onPrevious={draft.goToPreviousMonth}
        onNext={draft.goToNextMonth}
        onOpenYears={() => setYearsOpen((open) => !open)}
        yearsOpen={yearsOpen}
      />

      {yearsOpen ? (
        <YearPicker year={draft.year} onSelect={handleSelectYear} height={cellSize * 6} />
      ) : (
        <CalendarGrid
          year={draft.year}
          monthIndex={draft.monthIndex}
          selected={draft.selected}
          onSelect={draft.setSelected}
          cellSize={cellSize}
        />
      )}

      <View
        style={{
          gap: 3,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: REG_COLORS.border,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "600", color: REG_COLORS.subtle }}>
          Selected Date
        </Text>
        <Text
          accessibilityLiveRegion="polite"
          style={{ fontSize: 15.5, fontWeight: "700", color: REG_COLORS.text }}
        >
          {draft.selected ? formatBirthDate(draft.selected) : "No date selected"}
        </Text>
      </View>
    </View>
  );
};

export default DatePickerPanel;
