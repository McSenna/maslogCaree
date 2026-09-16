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

import { useSheetAnimation } from "./bottomSheet/useSheetAnimation";
import { useSheetPanResponder } from "./bottomSheet/useSheetPanResponder";

const SHEET_MAX_WIDTH = BREAKPOINTS.tablet;

export const SHEET_SCROLL_STYLE = (
  Platform.OS === "web" ? { overscrollBehavior: "contain" } : {}
) as object;

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
}: BottomSheetProps) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSheet = width < SHEET_MAX_WIDTH;

  const { translateY, scrimOpacity, animateOut, requestClose, onSheetLayout } =
    useSheetAnimation({ visible, isSheet, height, onClose });

  const panResponder = useSheetPanResponder({ translateY, animateOut, onClose });

  if (!visible) return null;

  const sheetMaxHeight = Math.round(height * (isSheet ? maxHeightRatio : 0.88));

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
          <View {...(isSheet ? panResponder.panHandlers : {})}>
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

          <View
            className="w-full min-h-0 flex-1"
            style={{ paddingBottom: isSheet ? Math.max(insets.bottom, 8) : 0 }}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;
