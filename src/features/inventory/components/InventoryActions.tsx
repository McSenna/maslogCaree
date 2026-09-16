import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { can, type InventoryItem, type InventoryPermissions } from "@/features/inventory/services/inventoryService";
import { RADIUS, useInventoryPalette } from "./inventoryTheme";

export type InventoryActionHandlers = {
  onAddStock: () => void;
  onReleaseStock: () => void;
  onEditItem: () => void;
  onViewHistory: () => void;
};

type InventoryActionsProps = {
  item: InventoryItem;
  permissions: InventoryPermissions;
  handlers: InventoryActionHandlers;
  stacked?: boolean;
};

type ActionSpec = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  primary: boolean;
  disabled?: boolean;
};

const ActionButton = ({ action, palette }: { action: ActionSpec; palette: ReturnType<typeof useInventoryPalette> }) => {
  const { primary, disabled } = action;

  return (
    <Pressable
      onPress={action.onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={action.label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      className="min-w-0 flex-1 flex-row items-center justify-center gap-2 border px-3 active:opacity-85"
      style={{
        height: 46,
        borderRadius: RADIUS.control,
        backgroundColor: primary ? palette.primary : palette.cardBg,
        borderColor: primary ? palette.primary : palette.cardBorder,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <Feather name={action.icon} size={15} color={primary ? "#FFFFFF" : palette.body} />
      <Text
        className="text-[13px] font-semibold"
        numberOfLines={1}
        style={{ color: primary ? "#FFFFFF" : palette.body }}
      >
        {action.label}
      </Text>
    </Pressable>
  );
};

const InventoryActions = ({
  item,
  permissions,
  handlers,
  stacked = false,
}: InventoryActionsProps) => {
  const palette = useInventoryPalette();

  const actions: ActionSpec[] = [];

  if (can(permissions, "inventory.add_stock")) {
    actions.push({
      key: "add-stock",
      label: "Add Stock",
      icon: "plus",
      onPress: handlers.onAddStock,
      primary: true,
    });
  }
  if (can(permissions, "inventory.release_stock")) {
    actions.push({
      key: "release-stock",
      label: "Release Stock",
      icon: "external-link",
      onPress: handlers.onReleaseStock,
      primary: false,
      disabled: item.currentStock <= 0 || item.expiryStatus === "expired",
    });
  }
  if (can(permissions, "inventory.edit")) {
    actions.push({
      key: "edit-item",
      label: "Edit Item",
      icon: "edit-2",
      onPress: handlers.onEditItem,
      primary: false,
    });
  }
  if (can(permissions, "inventory.view_history")) {
    actions.push({
      key: "view-history",
      label: "View History",
      icon: "clock",
      onPress: handlers.onViewHistory,
      primary: false,
    });
  }

  if (!actions.length) {
    return (
      <Text className="text-[12.5px]" style={{ color: palette.subtle }}>
        You have view-only access to inventory.
      </Text>
    );
  }

  if (stacked) {
    return (
      <View className="w-full gap-2">
        {actions.map((action) => (
          <View key={action.key} className="w-full flex-row">
            <ActionButton action={action} palette={palette} />
          </View>
        ))}
      </View>
    );
  }

  const rows: ActionSpec[][] = [];
  for (let index = 0; index < actions.length; index += 2) {
    rows.push(actions.slice(index, index + 2));
  }

  return (
    <View className="w-full gap-2">
      {rows.map((row) => (
        <View key={row.map((a) => a.key).join("-")} className="w-full flex-row gap-2">
          {row.map((action) => (
            <ActionButton key={action.key} action={action} palette={palette} />
          ))}
          {row.length === 1 ? <View className="flex-1" /> : null}
        </View>
      ))}
    </View>
  );
};

export default InventoryActions;
