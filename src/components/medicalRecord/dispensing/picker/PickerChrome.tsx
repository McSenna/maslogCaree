import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { InventoryCategory } from "@/features/inventory/services/inventoryService";

export const PickerHeader = ({ title, onClose }: { title: string; onClose: () => void }) => {
  const palette = useQueuePalette();

  return (
    <View
      className="flex-row items-center justify-between gap-3 px-4 py-3.5"
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <Text
        accessibilityRole="header"
        className="min-w-0 flex-1 text-[16px] font-bold"
        style={{ color: palette.heading }}
      >
        {title}
      </Text>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close the inventory picker"
        hitSlop={12}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.skeleton }}
      >
        <Feather name="x" size={17} color={palette.muted} />
      </Pressable>
    </View>
  );
};

export const PickerSearchBar = ({
  search,
  onChangeText,
  placeholder,
  loading,
}: {
  search: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  loading: boolean;
}) => {
  const palette = useQueuePalette();

  return (
    <View className="px-4 pb-2 pt-3">
      <View
        className="w-full flex-row items-center gap-2 px-3"
        style={{
          height: 44,
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.panelBorder,
          backgroundColor: palette.panelBg,
        }}
      >
        <Feather name="search" size={16} color={palette.subtle} />
        <TextInput
          value={search}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.subtle}
          accessibilityLabel="Search inventory by name, category or batch"
          autoCapitalize="none"
          autoCorrect={false}
          className="min-w-0 flex-1 text-[14px]"
          style={{ color: palette.body, outlineStyle: "none" } as never}
        />
        {loading ? <ActivityIndicator size="small" color={palette.primary} /> : null}
      </View>
    </View>
  );
};

export const PickerEmptyState = ({ category }: { category?: InventoryCategory }) => {
  const palette = useQueuePalette();

  return (
    <View className="items-center gap-2 px-6 py-12">
      <Feather name="search" size={22} color={palette.subtle} />
      <Text className="text-center text-[13.5px] font-semibold" style={{ color: palette.body }}>
        No inventory items found.
      </Text>
      <Text
        className="text-center text-[12.5px] leading-[18px]"
        style={{ color: palette.muted }}
      >
        {category
          ? `Nothing in the ${category} category matches that search.`
          : "Try searching another item name or category."}
      </Text>
    </View>
  );
};
