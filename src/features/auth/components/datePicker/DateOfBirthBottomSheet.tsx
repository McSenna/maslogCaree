import { ScrollView, Text, View } from "react-native";

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
}: DateOfBirthBottomSheetProps) => (
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
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 18 }}
      showsVerticalScrollIndicator={false}
    >
      <DatePickerPanel draft={draft} cellSize={42} />
      <DatePickerActions
        onCancel={onCancel}
        onConfirm={onConfirm}
        canConfirm={Boolean(draft.selected)}
        height={48}
      />
    </ScrollView>
  </BottomSheet>
);

export default DateOfBirthBottomSheet;
