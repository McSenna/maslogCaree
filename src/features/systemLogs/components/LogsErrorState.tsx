import { View } from "react-native";

import { TableErrorState } from "@/components/data-table";

import { useSystemLogsPalette } from "./systemLogsTheme";

export const LOGS_ERROR = "Unable to load system logs.";

/** The phone list's error state, in a card; the desktop table draws the same one itself. */
const LogsErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  const palette = useSystemLogsPalette();
  return (
    <View className="rounded-lg border" style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}>
      <TableErrorState title={LOGS_ERROR} message={message} onRetry={onRetry} />
    </View>
  );
};

export default LogsErrorState;
