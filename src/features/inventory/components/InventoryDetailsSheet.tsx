import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";

import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import type { InventoryItem, InventoryPermissions } from "@/features/inventory/services/inventoryService";
import InventoryActions, { type InventoryActionHandlers } from "./InventoryActions";
import InventoryDetailRow from "./InventoryDetailRow";
import InventoryItemSummary from "./InventoryItemSummary";
import { buildDetailFields } from "./inventoryDetailFields";
import { useInventoryPalette } from "./inventoryTheme";
import { createShadow } from "@/design/shadow";

type InventoryDetailsSheetProps = {
  visible: boolean;
  item: InventoryItem | null;
  permissions: InventoryPermissions;
  loading?: boolean;
  onClose: () => void;
  handlers: InventoryActionHandlers;
};

const NARROW_WIDTH = 340;

const InventoryDetailsSheet = ({
  visible,
  item,
  permissions,
  loading = false,
  onClose,
  handlers,
}: InventoryDetailsSheetProps) => {
  const palette = useInventoryPalette();
  const { width } = useWindowDimensions();
  const layout = useSheetLayout({ enabled: visible, maxHeightRatio: 0.9 });

  if (!item) return null;

  const fields = buildDetailFields(item);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={backDismissesKeyboardFirst(layout, onClose)}
      statusBarTranslucent
    >
      <SheetViewport layout={layout} style={{ backgroundColor: "rgba(15,37,87,0.35)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close inventory item details"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxHeight: layout.maxHeight,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: palette.cardBg,
            ...createShadow({
              color: "#0F2557",
              offsetY: -6,
              radius: 24,
              opacity: 0.2,
              elevation: 16,
            }),
          }}
        >
          <View className="items-center pb-1 pt-2.5">
            <View
              style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: palette.divider }}
            />
          </View>

          <View
            className="flex-row items-center justify-between px-4 pb-3 pt-1"
            style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
          >
            <Text
              accessibilityRole="header"
              className="text-[16px] font-bold"
              style={{ color: palette.heading }}
            >
              Inventory Item Details
            </Text>
            <View className="flex-row items-center gap-2">
              {loading ? <ActivityIndicator size="small" color={palette.primary} /> : null}
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close inventory item details"
                hitSlop={13}
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: palette.divider }}
              >
                <Feather name="x" size={16} color={palette.muted} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={SHEET_SCROLL_STYLE}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, gap: 14 }}
          >
            <InventoryItemSummary item={item} />

            <View className="w-full">
              {fields.map((field) => (
                <InventoryDetailRow
                  key={field.key}
                  icon={field.icon}
                  label={field.label}
                  value={field.value}
                  emphasis={field.emphasis}
                />
              ))}
            </View>
          </ScrollView>

          <View
            className="w-full px-4 pt-3"
            style={{
              borderTopWidth: 1,
              borderTopColor: palette.divider,
              paddingBottom: Math.max(layout.bottomInset, 12) + 4,
            }}
          >
            <InventoryActions
              item={item}
              permissions={permissions}
              handlers={handlers}
              stacked={width < NARROW_WIDTH}
            />
          </View>
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default InventoryDetailsSheet;
