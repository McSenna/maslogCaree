import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import TableButton from "./TableButton";
import { TABLE_TEXT } from "./tableTokens";

type TableErrorStateProps = {
  title: string;
  message?: string | null;
  onRetry?: () => void;
};

/** Why the rows are missing and a way to try again; the card is never left blank. */
const TableErrorState = ({ title, message, onRetry }: TableErrorStateProps) => {
  const colors = useThemeColors();

  return (
    <View accessibilityRole="alert" className="items-center gap-2 px-4 py-12">
      <View style={[styles.icon, { backgroundColor: colors.danger.bg }]}>
        <Feather name="alert-circle" size={20} color={colors.danger.fg} />
      </View>
      <Text style={[TABLE_TEXT.emptyTitle, styles.center, { color: colors.heading }]}>{title}</Text>
      <Text style={[TABLE_TEXT.cell, styles.center, styles.copy, { color: colors.muted }]}>
        {message || "Check your connection, then try again."}
      </Text>
      {onRetry ? (
        <View className="mt-2">
          <TableButton
            icon="rotate-cw"
            label="Try again"
            accessibilityLabel={`Try again: ${title}`}
            onPress={onRetry}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 44,
    height: 44,
    borderRadius: RADII.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  center: { textAlign: "center" },
  copy: { maxWidth: 360 },
});

export default TableErrorState;
