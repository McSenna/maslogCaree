import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import TableButton from "./TableButton";
import { TABLE_TEXT } from "./tableTokens";
import type { EmptyAction, FeatherName } from "./types";

type TableEmptyStateProps = {
  title: string;
  description?: string;
  icon?: FeatherName;
  action?: EmptyAction;
};

/** What goes in this table, and the next step. */
const TableEmptyState = ({
  title,
  description,
  icon = "users",
  action,
}: TableEmptyStateProps) => {
  const colors = useThemeColors();

  return (
    <View className="items-center gap-2 px-4 py-12">
      <View style={[styles.icon, { backgroundColor: colors.neutral.bg }]}>
        <Feather name={icon} size={20} color={colors.muted} />
      </View>
      <Text accessibilityRole="header" style={[TABLE_TEXT.emptyTitle, styles.center, { color: colors.heading }]}>
        {title}
      </Text>
      {description ? (
        <Text style={[TABLE_TEXT.cell, styles.center, styles.copy, { color: colors.muted }]}>{description}</Text>
      ) : null}
      {action ? (
        <View className="mt-2">
          <TableButton
            variant={action.variant ?? "primary"}
            icon={action.icon}
            label={action.label}
            accessibilityLabel={action.label}
            onPress={action.onPress}
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

export default TableEmptyState;
