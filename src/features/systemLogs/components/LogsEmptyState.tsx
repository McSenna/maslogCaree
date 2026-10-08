import { View } from "react-native";

import { TableEmptyState } from "@/components/data-table";

import { useSystemLogsPalette } from "./systemLogsTheme";

/** No activity yet, or nothing matching the search and filters. */
export const logsEmptyCopy = (hasFilters: boolean) => ({
  title: hasFilters ? "No logs match your search." : "No system logs found.",
  description: hasFilters ? "Try adjusting your filters or search terms." : "There are currently no activity records to display.",
});

/** The phone list's empty state, in a card; the desktop table draws the same one itself. */
const LogsEmptyState = ({ hasFilters }: { hasFilters: boolean }) => {
  const palette = useSystemLogsPalette();
  const copy = logsEmptyCopy(hasFilters);
  return (
    <View className="rounded-lg border" style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}>
      <TableEmptyState icon="activity" title={copy.title} description={copy.description} />
    </View>
  );
};

export default LogsEmptyState;
