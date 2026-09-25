import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";
import { useResponsive } from "@/hooks/useResponsive";

type MissionPickerModalProps = {
  visible: boolean;
  title: string;
  summary: string;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
};

const MissionPickerModal = ({
  visible,
  title,
  summary,
  onCancel,
  onConfirm,
  children,
}: MissionPickerModalProps) => {
  const palette = useMissionSchedulePalette();
  const { isMobile } = useResponsive();
  const isSheet = isMobile;
  const layout = useSheetLayout({
    enabled: visible,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: isSheet ? 0.9 : 0.88,
    edgePadding: isSheet ? 0 : 20,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={backDismissesKeyboardFirst(layout, onCancel)}
      statusBarTranslucent
    >
      <SheetViewport
        layout={layout}
        style={{ backgroundColor: palette.backdrop, paddingHorizontal: isSheet ? 0 : 20 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Close ${title} without changing it`}
          onPress={onCancel}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isSheet ? undefined : 420,
            // Bounded so a tall wheel picker cannot run off a short device.
            maxHeight: layout.maxHeight,
            borderTopLeftRadius: MISSION_RADIUS.sheet,
            borderTopRightRadius: MISSION_RADIUS.sheet,
            borderBottomLeftRadius: isSheet ? 0 : MISSION_RADIUS.sheet,
            borderBottomRightRadius: isSheet ? 0 : MISSION_RADIUS.sheet,
            backgroundColor: palette.surface,
            ...palette.shadow,
          }}
        >
          {isSheet ? (
            <View className="items-center pb-1 pt-3">
              <View
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={{ width: 42, height: 4.5, borderRadius: 3, backgroundColor: palette.border }}
              />
            </View>
          ) : null}

          <View className="px-5 pb-3 pt-4">
            <Text
              accessibilityRole="header"
              className="text-[17px] font-bold"
              style={{ color: palette.heading }}
            >
              {title}
            </Text>
            <Text
              accessibilityLiveRegion="polite"
              className="mt-0.5 text-[13px] font-medium"
              style={{ color: palette.primary }}
            >
              {summary}
            </Text>
          </View>

          <View className="px-5">{children}</View>

          <View
            className="flex-row gap-2.5 px-5 pt-4"
            style={{ paddingBottom: 16 + (isSheet ? layout.bottomInset : 0) }}
          >
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              className="h-12 flex-1 items-center justify-center active:opacity-85"
              style={{
                borderRadius: MISSION_RADIUS.field,
                borderWidth: 1,
                borderColor: palette.border,
              }}
            >
              <Text className="text-[14.5px] font-semibold" style={{ color: palette.body }}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={`Use this ${title.toLowerCase()}`}
              className="h-12 items-center justify-center active:opacity-90"
              style={{
                flex: 1.3,
                borderRadius: MISSION_RADIUS.field,
                backgroundColor: palette.primary,
              }}
            >
              <Text className="text-[14.5px] font-bold text-white">Done</Text>
            </Pressable>
          </View>
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default MissionPickerModal;
