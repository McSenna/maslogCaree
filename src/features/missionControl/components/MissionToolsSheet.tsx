import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";

type MissionToolsSheetProps = {
  visible: boolean;
  onClose: () => void;
  isPhone: boolean;
  palette: QueuePalette;
  children: ReactNode;
};

const MissionToolsSheet = ({
  visible,
  onClose,
  isPhone,
  palette,
  children,
}: MissionToolsSheetProps) => {
  const layout = useSheetLayout({
    enabled: visible,
    variant: isPhone ? "sheet" : "centered",
    maxHeightRatio: 0.92,
    edgePadding: isPhone ? 0 : 16,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isPhone ? "slide" : "fade"}
      onRequestClose={backDismissesKeyboardFirst(layout, onClose)}
      statusBarTranslucent
    >
      <SheetViewport
        layout={layout}
        style={{ backgroundColor: "rgba(15,37,87,0.35)", paddingHorizontal: isPhone ? 0 : 16 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close mission scheduling"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isPhone ? undefined : 640,
            maxHeight: layout.maxHeight,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isPhone ? 0 : 24,
            borderBottomRightRadius: isPhone ? 0 : 24,
            backgroundColor: palette.panelBg,
          }}
        >
          {isPhone ? (
            <View className="items-center pb-1 pt-2.5">
              <View
                style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }}
              />
            </View>
          ) : null}

          <View
            className="flex-row items-center justify-between px-5 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
          >
            <Text
              accessibilityRole="header"
              className="text-[17px] font-bold"
              style={{ color: palette.heading }}
            >
              Mission Scheduling
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close mission scheduling"
              hitSlop={12}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.skeleton }}
            >
              <Feather name="x" size={17} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView
            style={SHEET_SCROLL_STYLE}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              gap: 20,
              // Keeps the last tool clear of the gesture bar / home indicator.
              paddingBottom: 16 + (isPhone ? layout.bottomInset : 0),
            }}
          >
            {children}
          </ScrollView>
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default MissionToolsSheet;
