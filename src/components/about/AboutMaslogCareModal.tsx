import { useId } from "react";
import { Modal, Platform, Pressable, ScrollView, View, useWindowDimensions } from "react-native";

import { LANDING_COLORS } from "@/config/landingAssets";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import AboutMaslogCareContent from "./AboutMaslogCareContent";
import AboutFooter from "./AboutFooter";
import AboutHeader from "./AboutHeader";
import { CONTENT_GUTTER, ABOUT_RADIUS } from "./aboutTheme";

type AboutMaslogCareModalProps = {
  visible: boolean;
  onClose: () => void;
};

const MAX_WIDTH = 800;
const WIDE_CONTENT_WIDTH = 700;

const AboutMaslogCareModal = ({ visible, onClose }: AboutMaslogCareModalProps) => {
  const { width, height } = useWindowDimensions();
  const titleId = useId();

  useWebModalBehavior(visible, onClose);
  const attachFocusTrap = useFocusTrap(visible);

  const modalWidth = Math.min(MAX_WIDTH, width - 48);
  const wide = modalWidth >= WIDE_CONTENT_WIDTH;
  const gutter = wide ? CONTENT_GUTTER.wide : CONTENT_GUTTER.compact;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          backgroundColor: "rgba(8, 21, 47, 0.45)",
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close about MaslogCare"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          ref={attachFocusTrap as never}
          accessibilityViewIsModal
          accessibilityLabelledBy={titleId}
          {...Platform.select({ web: { role: "dialog", "aria-modal": true } as object })}
          style={{
            width: modalWidth,
            maxHeight: Math.round(height * 0.88),
            borderRadius: ABOUT_RADIUS.modal,
            backgroundColor: LANDING_COLORS.white,
            overflow: "hidden",
            ...Platform.select({
              web: { boxShadow: "0px 26px 70px rgba(8, 21, 47, 0.28)" } as object,
              default: { elevation: 16 },
            }),
          }}
        >
          <AboutHeader titleId={titleId} onClose={onClose} paddingHorizontal={gutter} />

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingHorizontal: gutter, paddingVertical: 20 }}
            showsVerticalScrollIndicator
          >
            <AboutMaslogCareContent wide={wide} />
          </ScrollView>

          <AboutFooter paddingHorizontal={gutter} />
        </View>
      </View>
    </Modal>
  );
};

export default AboutMaslogCareModal;
