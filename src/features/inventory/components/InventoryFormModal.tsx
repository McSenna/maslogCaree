import type { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Modal, Pressable, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BREAKPOINTS } from "@/constants/breakpoints";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";

import { useInventoryPalette } from "./inventoryTheme";
import InventoryModalBody from "./formModal/InventoryModalBody";
import InventoryModalFooter from "./formModal/InventoryModalFooter";
import InventoryModalHeader from "./formModal/InventoryModalHeader";
import { inventoryModalSurface } from "./formModal/inventoryModalSurface";

type InventoryFormModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  submitLabel: string;
  submitDisabled?: boolean;
  submitting?: boolean;
  error?: string | null;
  onSubmit: () => void;
  onClose: () => void;
  children: ReactNode;
};

const InventoryFormModal = ({
  visible,
  title,
  subtitle,
  icon,
  submitLabel,
  submitDisabled = false,
  submitting = false,
  error,
  onSubmit,
  onClose,
  children,
}: InventoryFormModalProps) => {
  const palette = useInventoryPalette();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const keyboardInset = useKeyboardInset(visible);

  const isMobile = width < BREAKPOINTS.tablet;
  // The form fields need the keyboard accounted for in the sheet's own height:
  // KeyboardAvoidingView cannot do it inside a statusBarTranslucent modal.
  const availableHeight = isMobile ? height - keyboardInset - insets.top : height;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className={`flex-1 ${isMobile ? "justify-end" : "items-center justify-center p-4"}`}
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Close ${title}`}
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className={`w-full overflow-hidden ${isMobile ? "" : "border"}`}
          style={[
            inventoryModalSurface({
              isMobile,
              height: availableHeight,
              cardBg: palette.cardBg,
              cardBorder: palette.cardBorder,
            }),
            isMobile ? { marginBottom: keyboardInset } : null,
          ]}
        >
          {isMobile ? (
            <View className="items-center pb-1 pt-2.5">
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={{
                  width: 44,
                  height: 4.5,
                  borderRadius: 3,
                  backgroundColor: palette.divider,
                }}
              />
            </View>
          ) : null}

          <InventoryModalHeader
            icon={icon}
            title={title}
            subtitle={subtitle}
            isMobile={isMobile}
            onClose={onClose}
          />

          <InventoryModalBody isMobile={isMobile} error={error}>
            {children}
          </InventoryModalBody>

          <InventoryModalFooter
            isMobile={isMobile}
            submitLabel={submitLabel}
            submitDisabled={submitDisabled}
            submitting={submitting}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

export { Field, TextField, ReadOnlyValue, SelectField } from "./InventoryFormFields";

export default InventoryFormModal;
