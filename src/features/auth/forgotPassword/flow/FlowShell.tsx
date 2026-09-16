import type { ReactNode } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

import { RECOVERY_COLORS as C, RECOVERY_RADIUS as R } from "../recoveryTheme";

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
}) => (
  <Modal
    visible={visible}
    transparent
    animationType={isSheet ? "slide" : "fade"}
    onRequestClose={onRequestClose}
    statusBarTranslucent
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
          maxHeight: isSheet ? "92%" : "90%",
          borderTopLeftRadius: isSheet ? R.sheet : R.modal,
          borderTopRightRadius: isSheet ? R.sheet : R.modal,
          borderBottomLeftRadius: isSheet ? 0 : R.modal,
          borderBottomRightRadius: isSheet ? 0 : R.modal,
          backgroundColor: C.surface,
          borderWidth: isSheet ? 0 : 1,
          borderColor: C.border,
          paddingHorizontal: isSheet ? 20 : 30,
          paddingTop: isSheet ? 12 : 24,
          paddingBottom: isSheet ? Math.max(insets.bottom, 16) + 8 : 26,
          shadowColor: "#0F172A",
          shadowOpacity: 0.14,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 12 },
          elevation: 12,
        }}
      >
        {isSheet ? (
          <View className="w-full items-center pb-3">
            <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: C.border }} />
          </View>
        ) : null}

        {children}
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export default FlowShell;
