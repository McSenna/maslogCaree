import type { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";

import { BREAKPOINTS } from "@/constants/breakpoints";

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

  const isMobile = width < BREAKPOINTS.tablet;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
          style={inventoryModalSurface({
            isMobile,
            height,
            cardBg: palette.cardBg,
            cardBorder: palette.cardBorder,
          })}
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

export { Field, TextField, ReadOnlyValue, SelectField } from "./InventoryFormFields";

export default InventoryFormModal;
