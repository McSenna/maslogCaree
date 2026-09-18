import { ScrollView, Text, View, useWindowDimensions } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";

import { REG_COLORS } from "../../registration/registrationTheme";
import DatePickerActions from "./DatePickerActions";
import DatePickerPanel from "./DatePickerPanel";
import type { useDateOfBirthDraft } from "./useDateOfBirthDraft";

type DateOfBirthBottomSheetProps = {
  visible: boolean;
  draft: ReturnType<typeof useDateOfBirthDraft>;
  onCancel: () => void;
  onConfirm: () => void;
};

const SheetHeader = () => (
  <View
    style={{
      paddingHorizontal: 20,
      paddingTop: 6,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: REG_COLORS.border,
    }}
  >
    <Text
      accessibilityRole="header"
      style={{ fontSize: 16.5, fontWeight: "800", color: REG_COLORS.text }}
    >
      Select Date of Birth
    </Text>
  </View>
);

const DateOfBirthBottomSheet = ({
  visible,
  draft,
  onCancel,
  onConfirm,
}: DateOfBirthBottomSheetProps) => {
  const { width } = useWindowDimensions();

  // Responsive cellSize so the 7 weekday columns fit comfortably across all phone widths
  const horizontalPadding = 20;
  const availableGridWidth = width - horizontalPadding * 2 - 14;
  const cellSize = Math.min(42, Math.max(34, Math.floor(availableGridWidth / 7)));

  return (
    <BottomSheet
      visible={visible}
      onClose={onCancel}
      accessibilityLabel="Select date of birth"
      surface={REG_COLORS.surface}
      handleColor={REG_COLORS.border}
      header={() => <SheetHeader />}
    >
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: 20,
          gap: 18,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <DatePickerPanel draft={draft} cellSize={cellSize} />
        <DatePickerActions
          onCancel={onCancel}
          onConfirm={onConfirm}
          canConfirm={Boolean(draft.selected)}
          height={48}
        />
      </ScrollView>
    </BottomSheet>
  );
};

export default DateOfBirthBottomSheet;
