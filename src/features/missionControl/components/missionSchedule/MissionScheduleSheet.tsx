import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";

import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";
import { useResponsive } from "@/hooks/useResponsive";

type MissionScheduleSheetProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
};


const DESKTOP_WIDTH = 720;
const DESKTOP_EDGE = 20;

const MissionScheduleSheet = ({
  visible,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: MissionScheduleSheetProps) => {
  const palette = useMissionSchedulePalette();
  const { isMobile } = useResponsive();
  const isSheet = isMobile;
  const layout = useSheetLayout({
    enabled: visible,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: isSheet ? 0.94 : 0.88,
    edgePadding: isSheet ? 0 : DESKTOP_EDGE,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={backDismissesKeyboardFirst(layout, onClose)}
      statusBarTranslucent
    >
      <SheetViewport
        layout={layout}
        style={{
          backgroundColor: palette.backdrop,
          paddingHorizontal: isSheet ? 0 : DESKTOP_EDGE,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close without creating a mission schedule"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isSheet ? undefined : DESKTOP_WIDTH,
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

          <View className="flex-row items-start gap-3 px-6 pb-4 pt-5">
            <View className="min-w-0 flex-1">
              <Text
                accessibilityRole="header"
                className={isSheet ? "text-[24px] font-bold" : "text-[27px] font-bold"}
                style={{ color: palette.heading, letterSpacing: -0.4 }}
              >
                {title}
              </Text>
              <Text className="mt-1.5 text-[13.5px] leading-[19px]" style={{ color: palette.muted }}>
                {subtitle}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close without creating a mission schedule"
              hitSlop={12}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.subtle }}
            >
              <Feather name="x" size={17} color={palette.muted} />
            </Pressable>
          </View>

          {/* Shrinks so the footer below stays on screen on short devices. */}
          <ScrollView
            style={SHEET_SCROLL_STYLE}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          >
            {children}
          </ScrollView>

          <View
            className="px-5 pt-3.5"
            style={{
              borderTopWidth: 1,
              borderTopColor: palette.divider,
              backgroundColor: palette.surface,
              paddingBottom: 14 + (isSheet ? layout.bottomInset : 0),
            }}
          >
            {footer}
          </View>
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default MissionScheduleSheet;
