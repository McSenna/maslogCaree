import type { ReactNode } from "react";
import { Modal, Pressable, View, useWindowDimensions } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

import { useKeyboardInset } from "@/hooks/useKeyboardInset";

import { RECOVERY_COLORS as C, RECOVERY_RADIUS as R } from "../recoveryTheme";
import { createShadow } from "@/design/shadow";

const FlowShell = ({
  visible,
  isSheet,
  insets,
  onRequestClose,
  children,
}: {
  visible: boolean;
  isSheet: boolean;
  insets: EdgeInsets;
  onRequestClose: () => void;
  children: ReactNode;
}) => {
  const { height } = useWindowDimensions();
  // Email, OTP and new-password fields all live in here, and
  // KeyboardAvoidingView is inert inside a statusBarTranslucent modal on
  // Android, so the shell tracks the keyboard itself.
  const keyboardInset = useKeyboardInset(visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View
        className={`flex-1 ${isSheet ? "justify-end" : "items-center justify-center p-5"}`}
        style={{ backgroundColor: "rgba(15,23,42,0.45)" }}
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
            maxHeight: isSheet
              ? Math.round((height - keyboardInset - insets.top) * 0.92)
              : Math.round(height * 0.9),
            marginBottom: isSheet ? keyboardInset : 0,
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
              ? keyboardInset > 0
                ? 16
                : Math.max(insets.bottom, 16) + 8
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

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default FlowShell;
