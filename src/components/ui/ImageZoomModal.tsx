import { Image, Modal, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IconButton from "@/components/buttons/IconButton";
import { useResponsive } from "@/hooks/useResponsive";
import { SPACING } from "@/theme/spacing";

type ImageZoomModalProps = {
  visible: boolean;
  uri: string;
  onClose: () => void;
  accessibilityLabel: string;
  maxImageWidth?: number;
};

const CLOSE_SIZE = 40;
const SCRIM = "rgba(2, 6, 23, 0.92)";

const ImageZoomModal = ({ visible, uri, onClose, accessibilityLabel, maxImageWidth = 1000 }: ImageZoomModalProps) => {
  const { width, height } = useResponsive();
  const insets = useSafeAreaInsets();
  const chrome = CLOSE_SIZE + SPACING.lg * 2;
  const imageWidth = Math.min(width - SPACING.lg * 2, maxImageWidth);
  const imageHeight = Math.max(0, height - insets.top - insets.bottom - chrome);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: SCRIM, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: SPACING.lg }}>
          <IconButton
            icon="x"
            label="Close enlarged image"
            tone="inverse"
            variant="soft"
            size={CLOSE_SIZE}
            showTooltip={false}
            onPress={onClose}
          />
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}
          maximumZoomScale={4}
          minimumZoomScale={1}
          bouncesZoom={Platform.OS !== "web"}
          centerContent
        >
          <Image
            source={{ uri }}
            resizeMode="contain"
            accessibilityLabel={accessibilityLabel}
            style={{ width: imageWidth, height: imageHeight }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ImageZoomModal;
