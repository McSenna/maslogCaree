import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";
import type { RegularDay } from "@/types/appointments.types";

import { monthLabel } from "../../regularSchedule/scheduleFormat";
import { buildMonthCells } from "../../regularSchedule/scheduleRules";
import { CalendarDayCell } from "./CalendarDayCell";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEB = webStyle({ cursor: "pointer" });

type Props = {
  palette: ResidentDialogPalette;
  monthKey: string;
  days: RegularDay[];
  todayKey: string;
  selectedDateKey: string | null;
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (dateKey: string) => void;
};

const MonthButton = ({ palette, icon, label, disabled, onPress }: { palette: ResidentDialogPalette; icon: "chevron-left" | "chevron-right"; label: string; disabled: boolean; onPress: () => void }) => {
  const { hovered, focused, handlers } = useInteractionState({ disabled });
  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className="h-11 w-11 items-center justify-center rounded-lg border"
      style={[
        { borderColor: palette.border, backgroundColor: hovered ? palette.accentSoft : palette.cardRaised, opacity: disabled ? 0.4 : 1 },
        focused ? focusRing(palette.accent) : null,
        disabled ? null : WEB,
      ]}
    >
      <Feather name={icon} size={18} color={palette.heading} />
    </Pressable>
  );
};

type LegendKind = "open" | "full" | "closed";

/** A sample date drawn the same way as the grid, so the legend matches what the resident sees. */
const LegendItem = ({ palette, kind, label }: { palette: ResidentDialogPalette; kind: LegendKind; label: string }) => (
  <View className="flex-row items-center gap-1.5">
    <View className="items-center">
      <Text
        style={[
          TYPE.caption,
          {
            color: kind === "open" ? palette.heading : palette.muted,
            fontWeight: kind === "open" ? "700" : "400",
            textDecorationLine: kind === "full" ? "line-through" : "none",
          },
        ]}
      >
        12
      </Text>
      <View className="h-1 w-1 rounded-full" style={{ backgroundColor: kind === "open" ? palette.successFg : "transparent" }} />
    </View>
    <Text style={[TYPE.caption, { color: palette.body }]}>{label}</Text>
  </View>
);

/** A month of dates; only the ones the server marks open can be chosen. */
export const ServiceCalendar = ({ palette, monthKey, days, todayKey, selectedDateKey, loading, canGoBack, canGoForward, onPrevious, onNext, onSelect }: Props) => (
  <View className="gap-2">
    <View className="flex-row items-center gap-2">
      <MonthButton palette={palette} icon="chevron-left" label="Previous month" disabled={!canGoBack || loading} onPress={onPrevious} />
      <View className="min-w-0 flex-1 flex-row items-center justify-center gap-2">
        <Text accessibilityRole="header" accessibilityLiveRegion="polite" aria-live="polite" style={[TYPE.title, { color: palette.heading }]}>
          {monthLabel(monthKey)}
        </Text>
        {loading ? <ActivityIndicator size="small" color={palette.accent} accessibilityLabel="Loading dates" /> : null}
      </View>
      <MonthButton palette={palette} icon="chevron-right" label="Next month" disabled={!canGoForward || loading} onPress={onNext} />
    </View>

    <View className="flex-row" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {WEEKDAY_LABELS.map((label) => (
        <Text key={label} className="w-[14.2857%] text-center" style={[TYPE.caption, { color: palette.muted }]}>
          {label}
        </Text>
      ))}
    </View>

    <View className="flex-row flex-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
      {buildMonthCells(monthKey, days).map((cell) =>
        cell.kind === "blank" ? (
          <View key={cell.key} className="w-[14.2857%]" />
        ) : (
          <CalendarDayCell
            key={cell.key}
            palette={palette}
            cell={cell}
            isSelected={cell.dateKey === selectedDateKey}
            isToday={cell.dateKey === todayKey}
            onSelect={onSelect}
          />
        )
      )}
    </View>

    <View className="flex-row flex-wrap gap-x-4 gap-y-1" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <LegendItem palette={palette} kind="open" label="Open times" />
      <LegendItem palette={palette} kind="full" label="Fully booked" />
      <LegendItem palette={palette} kind="closed" label="Closed or past" />
    </View>
  </View>
);

export default ServiceCalendar;
