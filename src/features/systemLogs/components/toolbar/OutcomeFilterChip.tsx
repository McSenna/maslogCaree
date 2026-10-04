import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSystemLogsPalette } from "../systemLogsTheme";

/**
 * Shown while the list is limited to successful entries (the "Successful
 * actions" card). That filter has no select in the toolbar, so this chip says
 * it is on and removes it.
 */
const OutcomeFilterChip = ({ onClear }: { onClear: () => void }) => {
  const palette = useSystemLogsPalette();
  return (
    <View className="flex-row">
      <Pressable
        onPress={onClear}
        accessibilityRole="button"
        accessibilityLabel="Showing successful actions only. Remove this filter"
        hitSlop={8}
        className="flex-row items-center gap-2 rounded-full border px-3"
        style={{ height: 32, backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
      >
        <Feather name="check-circle" size={13} color={palette.primary} />
        <Text className="text-[12.5px] font-semibold" style={{ color: palette.heading }}>
          Successful actions only
        </Text>
        <Feather name="x" size={14} color={palette.muted} />
      </Pressable>
    </View>
  );
};

export default OutcomeFilterChip;
