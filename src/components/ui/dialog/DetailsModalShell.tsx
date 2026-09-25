import type { ReactNode } from "react";
import { Animated, Modal, Platform, Pressable, View } from "react-native";

import { createShadow } from "@/design/shadow";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useDialogEnter } from "@/hooks/useDialogEnter";
import { useModalFrame } from "@/hooks/useModalFrame";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

export const DETAILS_MODAL_RADIUS = 20;

const BACKDROP_COLOR = "rgba(15,23,42,0.35)";
const BACKDROP_BLUR = Platform.OS === "web" ? ({ backdropFilter: "blur(3px)" } as object) : null;
const SURFACE_SHADOW = createShadow({
  color: "#0F2557",
  offsetY: 18,
  radius: 40,
  opacity: 0.22,
  elevation: 16,
});

type DetailsModalShellProps = {
  visible?: boolean;
  onClose: () => void;
  closeLabel: string;
  labelledBy?: string;
  maxWidth: number;
  height?: number;
  clip?: boolean;
  children: ReactNode;
};

const DetailsModalShell = ({
  visible = true,
  onClose,
  closeLabel,
  labelledBy,
  maxWidth,
  height: fixedHeight,
  clip = false,
  children,
}: DetailsModalShellProps) => {
  const palette = useAdminSurfacePalette();
  const frame = useModalFrame(maxWidth);

  useWebModalBehavior(visible, onClose);
  const setDialogNode = useFocusTrap(visible);
  const enter = useDialogEnter(visible);

  if (!visible) return null;

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });
  const labelProps = Platform.OS === "web" && labelledBy ? ({ "aria-labelledby": labelledBy } as object) : {};

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} {...labelProps}>
      <View className="flex-1 items-center justify-center p-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: BACKDROP_COLOR,
            ...BACKDROP_BLUR,
          }}
        />

        <Animated.View
          ref={setDialogNode}
          className="w-full border"
          style={{
            width: frame.width,
            height: fixedHeight === undefined ? undefined : Math.min(fixedHeight, frame.maxHeight),
            maxHeight: frame.maxHeight,
            borderRadius: DETAILS_MODAL_RADIUS,
            backgroundColor: palette.cardBg,
            borderColor: palette.cardBorder,
            overflow: clip ? "hidden" : undefined,
            opacity: enter,
            transform: [{ scale }],
            ...SURFACE_SHADOW,
          }}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DetailsModalShell;
