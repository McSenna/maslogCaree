import { useId } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { LANDING_COLORS } from "@/config/landingAssets";

import LearnMoreContent from "./LearnMoreContent";
import LearnMoreFooter from "./LearnMoreFooter";
import LearnMoreHeader from "./LearnMoreHeader";
import { CONTENT_GUTTER } from "./learnMoreTheme";

type LearnMoreBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const LearnMoreBottomSheet = ({ visible, onClose }: LearnMoreBottomSheetProps) => {
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
      maxHeightRatio={0.92}
      header={(requestClose) => (
        <LearnMoreHeader
          titleId={titleId}
          onClose={requestClose}
          paddingHorizontal={gutter}
          compact
        />
      )}
    >
      <ScrollView
        style={[SHEET_SCROLL_STYLE, { flexShrink: 1 }]}
        contentContainerStyle={{ paddingHorizontal: gutter, paddingVertical: 18 }}
        showsVerticalScrollIndicator
      >
        <LearnMoreContent wide={false} />
      </ScrollView>

      <LearnMoreFooter paddingHorizontal={gutter} bottomInset={Math.max(insets.bottom, 4)} />
    </BottomSheet>
  );
};

export default LearnMoreBottomSheet;
