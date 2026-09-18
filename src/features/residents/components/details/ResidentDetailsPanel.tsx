import { Animated, Modal, Platform, Pressable, View, useWindowDimensions } from "react-native";

import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { DETAIL_RADIUS, useUserDetailsPalette } from "@/features/users/components/details/detailsTheme";

import type { ResidentRecord } from "../../services/residentService";
import { useDialogEnter } from "@/hooks/useDialogEnter";

import { PanelBody } from "./panel/PanelBody";
import { PanelHeader, TITLE_ID } from "./panel/PanelHeader";
import { createShadow } from "@/design/shadow";

const MAX_WIDTH = 860;

const TWO_COLUMN_WIDTH = 820;

const dialogAccessibilityProps =
  Platform.OS === "web" ? ({ "aria-labelledby": TITLE_ID } as object) : {};

export type ResidentDetailsProps = {
  visible: boolean;
  resident: ResidentRecord | null;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const ResidentDetailsPanel = ({
  visible,
  resident,
  onClose,
  loading = false,
  error = null,
  onRetry,
}: ResidentDetailsProps) => {
  const palette = useUserDetailsPalette();
  const { width, height } = useWindowDimensions();

  useWebModalBehavior(visible, onClose);
  const setDialogNode = useFocusTrap(visible);
  const enter = useDialogEnter(visible);

  if (!visible) return null;

  const compact = width < TWO_COLUMN_WIDTH;
  const dialogWidth = Math.min(MAX_WIDTH, width * (width < 640 ? 0.94 : 0.92));
  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      {...dialogAccessibilityProps}
    >
      <View className="flex-1 items-center justify-center p-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close resident details"
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(15,23,42,0.35)",
            ...(Platform.OS === "web" ? ({ backdropFilter: "blur(3px)" } as object) : null),
          }}
        />

        <Animated.View
          ref={setDialogNode}
          className="w-full border"
          style={{
            width: dialogWidth,
            maxWidth: MAX_WIDTH,
            maxHeight: height * 0.9,
            borderRadius: DETAIL_RADIUS.modal,
            backgroundColor: palette.cardBg,
            borderColor: palette.cardBorder,
            opacity: enter,
            transform: [{ scale }],
            ...createShadow({
              color: "#0F2557",
              offsetY: 18,
              radius: 40,
              opacity: 0.22,
              elevation: 16,
            }),
          }}
        >
          <View className="px-7 pb-5 pt-7">
            <PanelHeader onClose={onClose} />
          </View>

          <PanelBody
            resident={resident}
            loading={loading}
            error={error}
            onRetry={onRetry}
            compact={compact}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ResidentDetailsPanel;
