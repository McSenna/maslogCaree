import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useSystemLogsPalette } from "./systemLogsTheme";

type LogsEmptyStateProps = {
  hasFilters: boolean;
  bare?: boolean;
};

const LogsEmptyState = ({ hasFilters, bare = false }: LogsEmptyStateProps) => {
  const palette = useSystemLogsPalette();

  return (
    <View
      className={`items-center gap-3 p-10 ${bare ? "" : "rounded-2xl border"}`}
      style={bare ? undefined : { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.iconWell }}
      >
        <Feather name="activity" size={20} color={palette.subtle} />
      </View>
      <View className="items-center gap-1">
        <Text className="text-sm font-semibold" style={{ color: palette.heading }}>
          {hasFilters ? "No logs match your search." : "No system logs found."}
        </Text>
        <Text className="text-center text-xs" style={{ color: palette.muted }}>
          {hasFilters
            ? "Try adjusting your filters or search terms."
            : "There are currently no activity records to display."}
        </Text>
      </View>
    </View>
  );
};

export default LogsEmptyState;
