import { useId } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { LANDING_COLORS } from "@/config/landingAssets";

import AboutMaslogCareContent from "./AboutMaslogCareContent";
import AboutFooter from "./AboutFooter";
import AboutHeader from "./AboutHeader";
import { CONTENT_GUTTER } from "./aboutTheme";

type AboutMaslogCareBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const AboutMaslogCareBottomSheet = ({ visible, onClose }: AboutMaslogCareBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const titleId = useId();
  const gutter = CONTENT_GUTTER.compact;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      accessibilityLabel="About MaslogCare"
      surface={LANDING_COLORS.white}
      handleColor={LANDING_COLORS.border}
      maxHeightRatio={0.9}
      applyBottomInset={false}
      header={(requestClose) => (
        <AboutHeader
          titleId={titleId}
          onClose={requestClose}
          paddingHorizontal={gutter}
          compact
        />
      )}
    >
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={{ paddingHorizontal: gutter, paddingVertical: 18 }}
        showsVerticalScrollIndicator
      >
        <AboutMaslogCareContent wide={false} />
      </ScrollView>

      <AboutFooter paddingHorizontal={gutter} bottomInset={Math.max(insets.bottom, 12)} />
    </BottomSheet>
  );
};

export default AboutMaslogCareBottomSheet;
