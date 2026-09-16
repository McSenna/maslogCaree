import { Animated, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { useSheetDragDismiss } from "@/hooks/useSheetDragDismiss";
import { useUserDetailsPalette } from "@/features/users/components/details/detailsTheme";
import ResidentSheetBody from "./ResidentSheetBody";
import ResidentSheetHeader, { TITLE_ID } from "./ResidentSheetHeader";
import type { ResidentDetailsProps } from "./ResidentDetailsPanel";

const dialogAccessibilityProps =
  Platform.OS === "web" ? ({ "aria-labelledby": TITLE_ID } as object) : {};

const ResidentDetailsSheet = ({
  visible,
  resident,
  onClose,
  loading = false,
  error = null,
  onRetry,
}: ResidentDetailsProps) => {
  const palette = useUserDetailsPalette();
  const insets = useSafeAreaInsets();

  useWebModalBehavior(visible, onClose);

  const { dragY, panResponder, height } = useSheetDragDismiss(visible, onClose);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      {...dialogAccessibilityProps}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,23,42,0.35)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close resident details"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <Animated.View
          className="w-full overflow-hidden"
          style={{
            maxHeight: height * 0.92,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: palette.cardBg,
            transform: [{ translateY: dragY }],
            shadowColor: "#0F2557",
            shadowOpacity: 0.2,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: -6 },
            elevation: 16,
          }}
        >
          <ResidentSheetHeader onClose={onClose} palette={palette} dragHandlers={panResponder.panHandlers} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 12 }}
          >
            <ResidentSheetBody
              resident={resident}
              loading={loading}
              error={error}
              onRetry={onRetry}
              muted={palette.muted}
            />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ResidentDetailsSheet;
