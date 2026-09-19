import { type ReactNode } from "react";
import { Animated, Keyboard, Modal, Platform, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BREAKPOINTS } from "@/constants/breakpoints";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import SheetHandle from "./bottomSheet/SheetHandle";
import SheetScrim from "./bottomSheet/SheetScrim";
import { buildSheetSurfaceStyle } from "./bottomSheet/sheetSurfaceStyle";
import { useSheetAnimation } from "./bottomSheet/useSheetAnimation";
import { useSheetPanResponder } from "./bottomSheet/useSheetPanResponder";
import { useSheetViewport } from "./bottomSheet/useSheetViewport";

const SHEET_MAX_WIDTH = BREAKPOINTS.tablet;
const MIN_BOTTOM_GAP = 12;

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
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSheet = width < SHEET_MAX_WIDTH;
  const keyboardInset = useKeyboardInset(visible);
  const viewport = useSheetViewport(keyboardInset, height);

  const { translateY, scrimOpacity, animateOut, requestClose, onSheetLayout } = useSheetAnimation({
    visible,
    isSheet,
    height,
    onClose,
  });

  const panResponder = useSheetPanResponder({ translateY, animateOut, onClose });

  useWebModalBehavior(visible, requestClose);

  if (!visible) return null;

  const isKeyboardVisible = keyboardInset > 0 || viewport.systemAlreadyResized;
  const usableHeight = viewport.availableHeight - viewport.keyboardGap;
  const ratio = isSheet ? maxHeightRatio : 0.88;
  const sheetMaxHeight = Math.round(
    isSheet ? Math.min(usableHeight - insets.top, usableHeight * ratio) : usableHeight * ratio
  );

  const bottomInset = !isSheet || !applyBottomInset
    ? 0
    : isKeyboardVisible
      ? 0
      : Math.max(insets.bottom, MIN_BOTTOM_GAP);

  const handleAndroidBack = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
      return;
    }
    if (onDismissRequest?.()) return;
    requestClose();
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={handleAndroidBack} statusBarTranslucent>
      <View
        onLayout={(event) => viewport.onContainerLayout(event.nativeEvent.layout.height)}
        style={[
          { flex: 1 },
          isSheet
            ? { justifyContent: "flex-end" }
            : { alignItems: "center", justifyContent: "center", padding: 16 },
        ]}
      >
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
              maxHeight: sheetMaxHeight,
              marginBottom: isSheet ? viewport.keyboardGap : 0,
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
      </View>
    </Modal>
  );
};

export default BottomSheet;
