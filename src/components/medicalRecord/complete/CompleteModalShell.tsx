import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { SHEET_KEYBOARD_DISMISS_MODE } from "@/components/ui/sheetLayout/sheetScroll";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";

import ModalHeader from "./ModalHeader";
import { useResponsive } from "@/hooks/useResponsive";

export { SectionCard } from "./SectionCard";


export const PANEL_TWO_COLUMN_WIDTH = 640;

const DESKTOP_EDGE = 16;

const CompleteModalShell = ({
  visible,
  onRequestClose,
  dismissible,
  title,
  subtitle,
  badge,
  footer,
  children,
  onLayoutWidth,
}: {
  visible: boolean;
  onRequestClose: () => void;
  dismissible: boolean;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  onLayoutWidth?: (width: number) => void;
}) => {
  const palette = useQueuePalette();
  const { isMobile } = useResponsive();
  const isSheet = isMobile;
  // This form is full of inputs; the shared layout keeps it above the keyboard
  // and the sheet below the status bar.
  const layout = useSheetLayout({
    enabled: visible,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: isSheet ? 0.94 : 0.9,
    edgePadding: isSheet ? 0 : DESKTOP_EDGE,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={backDismissesKeyboardFirst(layout, () => dismissible && onRequestClose())}
      statusBarTranslucent
    >
      <SheetViewport
        layout={layout}
        style={{
          backgroundColor: "rgba(15,37,87,0.35)",
          paddingHorizontal: isSheet ? 0 : DESKTOP_EDGE,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close without completing"
          onPress={() => dismissible && onRequestClose()}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          onLayout={(event) => onLayoutWidth?.(event.nativeEvent.layout.width)}
          style={{
            maxWidth: isSheet ? undefined : 920,
            maxHeight: layout.maxHeight,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isSheet ? 0 : 24,
            borderBottomRightRadius: isSheet ? 0 : 24,
            backgroundColor: palette.pageBg,
          }}
        >
          {isSheet ? (
            <View className="items-center pb-1 pt-2.5">
              <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }} />
            </View>
          ) : null}

          <ModalHeader
            title={title}
            subtitle={subtitle}
            badge={badge}
            dismissible={dismissible}
            onRequestClose={onRequestClose}
            palette={palette}
          />

          <ScrollView
            style={SHEET_SCROLL_STYLE}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={SHEET_KEYBOARD_DISMISS_MODE}
            contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 14 }}
          >
            {children}
          </ScrollView>

          {footer ? (
            <View
              className="px-4 pt-3.5"
              style={{
                backgroundColor: palette.panelBg,
                borderTopWidth: 1,
                borderTopColor: palette.divider,
                paddingBottom: 14 + (isSheet ? layout.bottomInset : 0),
              }}
            >
              {footer}
            </View>
          ) : null}
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default CompleteModalShell;
