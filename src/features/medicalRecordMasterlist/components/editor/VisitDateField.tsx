import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { buildShellStyle, FieldHelper, FieldLabel } from "@/components/medicalRecord/fields/fieldShell";
import type { MedicalField } from "@/services/medicalRecords";

import { formatCalendarDay } from "../../masterlistLabels";

const FIELD: MedicalField = { key: "visitDate", label: "Visit date", type: "date", required: true };

type Props = { value: string; error?: string; onOpen: () => void };

/** Opens the app's calendar; the date is never typed, so it is always a real day. */
const VisitDateField = ({ value, error, onOpen }: Props) => {
  const palette = useQueuePalette();
  const shown = value ? formatCalendarDay(value) : "";

  return (
    <View className="w-full">
      <FieldLabel field={FIELD} palette={palette} />
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Visit date, required. ${shown || "Not chosen"}`}
        accessibilityHint="Opens a calendar"
        className="min-h-11 w-full flex-row items-center gap-2.5 px-3 hover:opacity-90 active:opacity-80"
        style={buildShellStyle(palette, error)}
      >
        <Feather name="calendar" size={17} color={error ? palette.subtle : palette.primary} />
        <Text className="min-w-0 flex-1 text-[14px]" style={{ color: shown ? palette.heading : palette.subtle }}>
          {shown || "Choose the date on the record"}
        </Text>
        <Feather name="chevron-down" size={17} color={palette.subtle} />
      </Pressable>
      <FieldHelper helper={error ?? "The day of the visit, not today's date unless it happened today."} error={error} palette={palette} />
    </View>
  );
};

export default VisitDateField;
