import { Feather } from "@expo/vector-icons";
import { useId } from "react";
import { Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { useModalFrame } from "@/hooks/useModalFrame";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { PROFILE_COLORS as C, PROFILE_RADIUS, PROFILE_SHADOW } from "../config/profileTheme";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { useChangePassword } from "./useChangePassword";

type ChangePasswordModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const MODAL_WIDTH = 480;

export const ChangePasswordModal = ({
  visible,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) => {
  const frame = useModalFrame(MODAL_WIDTH);
  const titleId = useId();

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

  useWebModalBehavior(visible, handleClose);
  const attachFocusTrap = useFocusTrap(visible);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          backgroundColor: "rgba(15, 23, 42, 0.45)",
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close change password modal"
          onPress={handleClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          ref={attachFocusTrap as never}
          accessibilityViewIsModal
          accessibilityLabelledBy={titleId}
          {...Platform.select({ web: { role: "dialog", "aria-modal": true } as object })}
          style={{
            width: frame.width,
            maxHeight: frame.maxHeight,
            borderRadius: PROFILE_RADIUS.modal,
            backgroundColor: C.surface,
            overflow: "hidden",
            ...PROFILE_SHADOW.modal,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingTop: 22,
              paddingBottom: 14,
              borderBottomWidth: 1,
              borderBottomColor: C.divider,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: C.primarySoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="shield" size={18} color={C.primary} />
              </View>
              <Text
                id={titleId}
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: C.heading,
                }}
              >
                Change Password
              </Text>
            </View>

            <Pressable
              onPress={handleClose}
              disabled={changePasswordState.isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={10}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: C.background,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="x" size={18} color={C.muted} />
            </Pressable>
          </View>

          {/* Body Content */}
          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <ChangePasswordForm
              changePasswordState={changePasswordState}
              onCancel={handleClose}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;
