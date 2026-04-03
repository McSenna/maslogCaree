import type { ReactNode } from "react";

import { Modal as RNModal, Pressable, View } from "react-native";

export type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  transparent?: boolean;
  animationType?: "none" | "slide" | "fade";
  contentClassName?: string;
  overlayClassName?: string;
};

const AppModal = ({
  visible,
  onClose,
  children,
  transparent = true,
  animationType = "fade",
  contentClassName = "",
  overlayClassName = "bg-black/50",
}: AppModalProps) => {
  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close modal"
          onPress={onClose}
          className={["absolute inset-0", overlayClassName].join(" ")}
        />
        <View className={contentClassName}>{children}</View>
      </View>
    </RNModal>
  );
};

export default AppModal;

