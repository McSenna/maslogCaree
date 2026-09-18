import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { PROFILE_COLORS as C } from "../config/profileTheme";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { useChangePassword } from "./useChangePassword";

type ChangePasswordBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const ChangePasswordBottomSheet = ({
  visible,
  onClose,
  onSuccess,
}: ChangePasswordBottomSheetProps) => {
  const changePasswordState = useChangePassword({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  const handleClose = () => {
    if (changePasswordState.isSubmitting) return;
    changePasswordState.resetForm();
    onClose();
  };

  if (!visible) return null;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      accessibilityLabel="Change Password"
      surface={C.surface}
      handleColor={C.border}
      maxHeightRatio={0.92}
      header={() => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: C.divider,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: C.primarySoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="shield" size={16} color={C.primary} />
            </View>
            <Text
              accessibilityRole="header"
              style={{ fontSize: 17, fontWeight: "700", color: C.heading }}
            >
              Change Password
            </Text>
          </View>

          <Pressable
            onPress={handleClose}
            disabled={changePasswordState.isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Close sheet"
            hitSlop={8}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: C.background,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="x" size={16} color={C.muted} />
          </Pressable>
        </View>
      )}
    >
      {/*
        No KeyboardAvoidingView: the sheet renders in a `statusBarTranslucent`
        modal, where Android never delivers the resize it depends on. The sheet
        itself lifts above the keyboard, and this ScrollView keeps the focused
        field reachable.
      */}
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 12,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ChangePasswordForm
          changePasswordState={changePasswordState}
          onCancel={handleClose}
          compact
        />
      </ScrollView>
    </BottomSheet>
  );
};

export default ChangePasswordBottomSheet;
