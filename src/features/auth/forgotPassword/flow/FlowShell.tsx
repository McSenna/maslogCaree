import type { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";

import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { createShadow } from "@/design/shadow";

import { RECOVERY_COLORS as C, RECOVERY_RADIUS as R } from "../recoveryTheme";

const DESKTOP_EDGE = 20;

const FlowShell = ({
  visible,
  isSheet,
  onRequestClose,
  header,
  children,
}: {
  visible: boolean;
  isSheet: boolean;
  onRequestClose: () => void;
  /** Stays pinned above the scrolling steps so Back / Close are always reachable. */
  header: ReactNode;
  children: ReactNode;
}) => {
  // Email, OTP and new-password fields all live in here; the shared sheet layout
  // keeps them above the keyboard and the sheet below the status bar.
  const layout = useSheetLayout({
    enabled: visible,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: isSheet ? 0.92 : 0.9,
    edgePadding: isSheet ? 0 : DESKTOP_EDGE,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={backDismissesKeyboardFirst(layout, onRequestClose)}
      statusBarTranslucent
    >
      <SheetViewport
        layout={layout}
        style={{
          backgroundColor: "rgba(15,23,42,0.45)",
          paddingHorizontal: isSheet ? 0 : DESKTOP_EDGE,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close account recovery"
          onPress={onRequestClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isSheet ? undefined : 520,
            maxHeight: layout.maxHeight,
            borderTopLeftRadius: isSheet ? R.sheet : R.modal,
            borderTopRightRadius: isSheet ? R.sheet : R.modal,
            borderBottomLeftRadius: isSheet ? 0 : R.modal,
            borderBottomRightRadius: isSheet ? 0 : R.modal,
            backgroundColor: C.surface,
            borderWidth: isSheet ? 0 : 1,
            borderColor: C.border,
            paddingHorizontal: isSheet ? 20 : 30,
            paddingTop: isSheet ? 12 : 24,
            paddingBottom: isSheet
              ? layout.keyboardVisible
                ? 16
                : Math.max(layout.bottomInset, 16) + 8
              : 26,
            ...createShadow({
              color: "#0F172A",
              offsetY: 12,
              radius: 28,
              opacity: 0.14,
              elevation: 12,
            }),
          }}
        >
          {isSheet ? (
            <View className="w-full items-center pb-3">
              <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: C.border }} />
            </View>
          ) : null}

          {header}
          {children}
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default FlowShell;
