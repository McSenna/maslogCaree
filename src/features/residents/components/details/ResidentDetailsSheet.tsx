import { Platform, ScrollView, View } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
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

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      accessibilityLabel="Resident details"
      surface={palette.cardBg}
      handleColor={palette.divider}
      scrim="rgba(15,23,42,0.35)"
      header={(requestClose) => (
        <View {...dialogAccessibilityProps}>
          <ResidentSheetHeader onClose={requestClose} palette={palette} />
        </View>
      )}
    >
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        <ResidentSheetBody
          resident={resident}
          loading={loading}
          error={error}
          onRetry={onRetry}
          muted={palette.muted}
        />
      </ScrollView>
    </BottomSheet>
  );
};

export default ResidentDetailsSheet;
