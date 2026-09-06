import { Feather } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type UserSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function UserSearch({ value, onChangeText }: UserSearchProps) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={[
        "flex-row items-center gap-2.5 rounded-2xl border px-3.5 py-2.5",
        classes.border,
        isDark ? "bg-slate-800/80" : "bg-white",
      ].join(" ")}
    >
      <Feather
        name="search"
        size={16}
        color={isDark ? "#94a3b8" : "#9ca3af"}
      />
      <TextInput
        className={["flex-1 text-sm", classes.textPrimary].join(" ")}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by name, gender, address, or role…"
        placeholderTextColor={isDark ? "#475569" : "#9ca3af"}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}
