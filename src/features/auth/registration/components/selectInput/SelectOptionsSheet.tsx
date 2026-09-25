import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";

import { REG_COLORS, REG_RADIUS } from "../../registrationTheme";

const SelectOptionsSheet = <T extends string>({
  label,
  value,
  options,
  open,
  isSheet,
  onSelect,
  onClose,
}: {
  label: string;
  value: string;
  options: readonly { value: T; label: string }[];
  open: boolean;
  isSheet: boolean;
  onSelect: (value: T) => void;
  onClose: () => void;
}) => {
  const layout = useSheetLayout({
    enabled: open,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: 0.7,
    edgePadding: isSheet ? 0 : 24,
  });

  return (
    <Modal
      visible={open}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={backDismissesKeyboardFirst(layout, onClose)}
      statusBarTranslucent
    >
      <SheetViewport
        layout={layout}
        style={{ backgroundColor: REG_COLORS.overlay, paddingHorizontal: isSheet ? 0 : 24 }}
      >
        {/*
          The backdrop is its own layer behind the sheet. While the sheet sat
          inside it, a tap on the sheet's own padding counted as a backdrop tap
          and dismissed the picker.
        */}
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={`Close ${label} options`}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          accessibilityViewIsModal
          style={{
            width: "100%",
            maxWidth: isSheet ? undefined : 380,
            maxHeight: layout.maxHeight,
            backgroundColor: REG_COLORS.surface,
            borderTopLeftRadius: REG_RADIUS.sheet,
            borderTopRightRadius: REG_RADIUS.sheet,
            borderBottomLeftRadius: isSheet ? 0 : REG_RADIUS.sheet,
            borderBottomRightRadius: isSheet ? 0 : REG_RADIUS.sheet,
            paddingTop: 10,
            overflow: "hidden",
          }}
        >
          <Text
            accessibilityRole="header"
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontSize: 13,
              fontWeight: "700",
              color: REG_COLORS.muted,
            }}
          >
            {label}
          </Text>

          {/* Long option lists scroll rather than running off the screen. */}
          <ScrollView
            style={SHEET_SCROLL_STYLE}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: isSheet ? Math.max(layout.bottomInset, 12) + 8 : 10,
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onSelect(option.value)}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isSelected }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: 48,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15.5,
                      fontWeight: isSelected ? "600" : "400",
                      color: isSelected ? REG_COLORS.primary : REG_COLORS.text,
                    }}
                  >
                    {option.label}
                  </Text>
                  {isSelected ? <Feather name="check" size={18} color={REG_COLORS.primary} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default SelectOptionsSheet;
