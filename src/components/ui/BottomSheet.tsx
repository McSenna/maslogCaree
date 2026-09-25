import { type ReactNode } from "react";
import { Animated, Modal, Platform, View } from "react-native";

import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import SheetHandle from "./bottomSheet/SheetHandle";
import SheetScrim from "./bottomSheet/SheetScrim";
import { buildSheetSurfaceStyle } from "./bottomSheet/sheetSurfaceStyle";
import { useSheetAnimation } from "./bottomSheet/useSheetAnimation";
import { useSheetPanResponder } from "./bottomSheet/useSheetPanResponder";
import { useResponsive } from "@/hooks/useResponsive";

const MIN_BOTTOM_GAP = 12;
const DESKTOP_EDGE = 16;
const DESKTOP_HEIGHT_RATIO = 0.88;

export const SHEET_SCROLL_STYLE = {
  flexGrow: 0,
  flexShrink: 1,
  minHeight: 0,
  ...(Platform.OS === "web" ? { overscrollBehavior: "contain" } : {}),
} as object;

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  header?: (requestClose: () => void) => ReactNode;
  footer?: ReactNode;
  accessibilityLabel: string;
  surface: string;
  handleColor: string;
  scrim?: string;
  maxHeightRatio?: number;
  desktopWidth?: number;
  applyBottomInset?: boolean;
  onDismissRequest?: () => boolean;
};

const BottomSheet = ({
  visible,
  onClose,
  children,
  header,
  footer,
  accessibilityLabel,
  surface,
  handleColor,
  scrim = "rgba(15,37,87,0.35)",
  maxHeightRatio = 0.92,
  desktopWidth = 640,
  applyBottomInset = true,
  onDismissRequest,
}: BottomSheetProps) => {
  const { height, isMobile } = useResponsive();
  const isSheet = isMobile;
  const layout = useSheetLayout({
    enabled: visible,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: isSheet ? maxHeightRatio : DESKTOP_HEIGHT_RATIO,
    edgePadding: isSheet ? 0 : DESKTOP_EDGE,
  });

  const { translateY, scrimOpacity, animateOut, requestClose, onSheetLayout } = useSheetAnimation({
    visible,
    isSheet,
    height,
    onClose,
  });

  const panResponder = useSheetPanResponder({ translateY, animateOut, onClose });

  useWebModalBehavior(visible, requestClose);

  if (!visible) return null;

  const bottomInset =
    !isSheet || !applyBottomInset || layout.keyboardVisible
      ? 0
      : Math.max(layout.bottomInset, MIN_BOTTOM_GAP);

  const handleAndroidBack = backDismissesKeyboardFirst(layout, () => {
    if (onDismissRequest?.()) return;
    requestClose();
  });

  return (
    <Modal visible transparent animationType="none" onRequestClose={handleAndroidBack} statusBarTranslucent>
      <SheetViewport layout={layout} style={isSheet ? null : { paddingHorizontal: DESKTOP_EDGE }}>
        <SheetScrim color={scrim} opacity={isSheet ? scrimOpacity : 1} onPress={requestClose} />

        <Animated.View
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          onLayout={(event) => {
            if (isSheet) onSheetLayout(event.nativeEvent.layout.height);
          }}
          style={{
            ...buildSheetSurfaceStyle({
              isSheet,
              maxHeight: layout.maxHeight,
              desktopWidth,
              surface,
            }),
            transform: isSheet ? [{ translateY }] : undefined,
          }}
        >
          <View style={{ flexGrow: 0, flexShrink: 0 }} {...(isSheet ? panResponder.panHandlers : {})}>
            {isSheet ? <SheetHandle color={handleColor} /> : null}
            {header?.(requestClose)}
          </View>

          <View style={{ width: "100%", flexGrow: 0, flexShrink: 1, minHeight: 0 }}>{children}</View>

          {footer ? (
            <View style={{ flexGrow: 0, flexShrink: 0, paddingBottom: bottomInset }}>{footer}</View>
          ) : (
            <View style={{ height: bottomInset }} />
          )}
        </Animated.View>
      </SheetViewport>
    </Modal>
  );
};

export default BottomSheet;
