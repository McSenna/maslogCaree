import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

type PickerFieldProps = {
  label: string;
  value: string;
  icon: "calendar" | "clock";
  onPress: () => void;
  /** Layout for the field's wrapper — `flex-1` when two sit side by side. */
  className?: string;
  /** The date field's label is weighted; the time labels beneath it are not. */
  strongLabel?: boolean;
};

/**
 * A read-only field that opens the native picker.
 *
 * The mission date, start time and end time are all this same control, in both
 * the create panel and the edit sheet — six copies of the same markup before
 * it was named.
 */
export default function PickerField({
  label,
  value,
  icon,
  onPress,
  className,
  strongLabel = false,
}: PickerFieldProps) {
  return (
    <View className={className}>
      <Text className={`text-xs text-slate-600${strongLabel ? " font-semibold" : ""}`}>
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        className="mt-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2"
      >
        <Feather name={icon} size={14} color="#94A3B8" />
        <Text className="flex-1 pl-2 text-sm font-semibold text-slate-900">{value}</Text>
        <Feather name="chevron-down" size={14} color="#94A3B8" />
      </Pressable>
    </View>
  );
}
