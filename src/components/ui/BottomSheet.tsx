import { type ReactNode } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BREAKPOINTS } from "@/constants/breakpoints";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import { useSheetAnimation } from "./bottomSheet/useSheetAnimation";
import { useSheetPanResponder } from "./bottomSheet/useSheetPanResponder";

const SHEET_MAX_WIDTH = BREAKPOINTS.tablet;

/** Minimum gap between the sheet's action row and the device's bottom edge. */
const MIN_BOTTOM_GAP = 12;

/**
 * Style every scrollable region inside a sheet must carry.
 *
 * `flexShrink` with `minHeight: 0` is the load-bearing part: it makes the
 * scroll region the thing that gives when the sheet runs out of room, so a
 * pinned footer keeps its height and short content still renders a compact
 * sheet. Never add `flex: 1` on top of this — a flex child resolves against
 * the column's zero free space and collapses to nothing.
 */
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
  accessibilityLabel: string;
  surface: string;
  handleColor: string;
  scrim?: string;
  maxHeightRatio?: number;
  desktopWidth?: number;
  /** Set false for sheets whose own footer already owns the bottom inset. */
  applyBottomInset?: boolean;
};

const BottomSheet = ({
  visible,
  onClose,
  children,
  header,
  accessibilityLabel,
  surface,
  handleColor,
  scrim = "rgba(15,37,87,0.35)",
  maxHeightRatio = 0.92,
  desktopWidth = 640,
  applyBottomInset = true,
}: BottomSheetProps) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSheet = width < SHEET_MAX_WIDTH;
  const keyboardInset = useKeyboardInset(visible);

  const { translateY, scrimOpacity, animateOut, requestClose, onSheetLayout } =
    useSheetAnimation({ visible, isSheet, height, onClose });

  const panResponder = useSheetPanResponder({ translateY, animateOut, onClose });

  useWebModalBehavior(visible, requestClose);

  if (!visible) return null;

  // `marginBottom` below already lifts the whole sheet clear of the keyboard,
  // so this padding only ever covers the home indicator / gesture bar — and
  // while the keyboard is up, the keyboard is covering those anyway.
  const bottomInset =
    keyboardInset > 0 ? MIN_BOTTOM_GAP : applyBottomInset ? Math.max(insets.bottom, MIN_BOTTOM_GAP) : 0;

  const sheetMaxHeight = Math.round(
    (height - (isSheet ? keyboardInset + insets.top : 0)) * (isSheet ? maxHeightRatio : 0.88)
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={requestClose}
      statusBarTranslucent
    >
      <View className={`flex-1 ${isSheet ? "justify-end" : "items-center justify-center p-4"}`}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: scrim,
            opacity: isSheet ? scrimOpacity : 1,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={requestClose}
            style={{ flex: 1 }}
          />
        </Animated.View>

        <Animated.View
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          onLayout={(event) => {
            if (isSheet) onSheetLayout(event.nativeEvent.layout.height);
          }}
          style={{
            width: "100%",
            overflow: "hidden",
            maxWidth: isSheet ? undefined : desktopWidth,
            maxHeight: sheetMaxHeight,
            // The sheet is a column that sizes to its content and shrinks to
            // `maxHeight`; the scrollable region below is what gives.
            flexDirection: "column",
            marginBottom: isSheet ? keyboardInset : 0,
            backgroundColor: surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isSheet ? 0 : 24,
            borderBottomRightRadius: isSheet ? 0 : 24,
            transform: isSheet ? [{ translateY }] : undefined,
            ...(Platform.OS === "web"
              ? { boxShadow: "0 -8px 40px rgba(15,37,87,0.14)" }
              : {
                  shadowColor: "#0F2557",
                  shadowOpacity: 0.16,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: -6 },
                  elevation: 16,
                }),
          }}
        >
          <View style={{ flexGrow: 0, flexShrink: 0 }} {...(isSheet ? panResponder.panHandlers : {})}>
            {isSheet ? (
              <View className="w-full items-center pb-1 pt-2.5">
                <View
                  accessible
                  accessibilityLabel="Drag down to close"
                  style={{
                    width: 44,
                    height: 4.5,
                    borderRadius: 3,
                    backgroundColor: handleColor,
                  }}
                />
              </View>
            ) : null}
            {header?.(requestClose)}
          </View>

          {/*
            `minHeight: 0` is what lets this region shrink below the natural
            height of its content — without it a tall child pushes the column
            past `maxHeight` and the sheet's footer ends up off-screen. Children
            must size themselves to their content (no `flex: 1`), so that a
            short sheet stays compact and a tall one shrinks here and scrolls.
          */}
          <View
            style={{
              width: "100%",
              flexGrow: 0,
              flexShrink: 1,
              minHeight: 0,
              paddingBottom: isSheet ? bottomInset : 0,
            }}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;
