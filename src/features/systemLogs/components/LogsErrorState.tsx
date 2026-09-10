import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSystemLogsPalette } from "./systemLogsTheme";

type LogsErrorStateProps = {
  message: string;
  onRetry: () => void;
  /** True inside the table card, which already draws the border. */
  bare?: boolean;
};

/** The audit trail could not be read, with the one thing that resolves it. */
export default function LogsErrorState({ message, onRetry, bare = false }: LogsErrorStateProps) {
  const palette = useSystemLogsPalette();
  const errorTone = palette.severity.error;

  return (
    <View
      className={`items-center gap-3 p-10 ${bare ? "" : "rounded-2xl border"}`}
      style={bare ? undefined : { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: errorTone.bg }}
      >
        <Feather name="alert-circle" size={20} color={errorTone.dot} />
      </View>
      <View className="items-center gap-1">
        <Text className="text-sm font-semibold" style={{ color: palette.heading }}>
          Unable to load system logs.
        </Text>
        <Text className="text-center text-xs" style={{ color: palette.muted }}>
          {message}
        </Text>
      </View>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        className="h-11 justify-center rounded-xl px-5"
        style={{ backgroundColor: palette.primary }}
      >
        <Text className="text-sm font-semibold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}
