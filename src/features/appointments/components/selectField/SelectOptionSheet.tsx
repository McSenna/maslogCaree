import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";

import { APPOINTMENT_COLORS } from "../appointmentTheme";
import SelectOptionRow from "./SelectOptionRow";
import type { SelectOption } from "./selectFieldTypes";

type Props = {
  open: boolean;
  label: string;
  sheetTitle?: string;
  options: SelectOption[];
  value: string | null;
  emptyText: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

const SelectOptionSheet = ({
  open,
  label,
  sheetTitle,
  options,
  value,
  emptyText,
  onSelect,
  onClose,
}: Props) => (
  <BottomSheet
    visible={open}
    onClose={onClose}
    accessibilityLabel={sheetTitle ?? label}
    surface={APPOINTMENT_COLORS.white}
    handleColor={APPOINTMENT_COLORS.track}
    scrim="rgba(15,37,87,0.4)"
    maxHeightRatio={0.7}
    header={(requestClose) => (
      <>
        <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
          <Text
            accessibilityRole="header"
            style={{ fontSize: 16, fontWeight: "700", color: APPOINTMENT_COLORS.primaryDeep }}
          >
            {sheetTitle ?? label}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Close ${label.toLowerCase()} picker`}
            hitSlop={12}
            onPress={requestClose}
            className="h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: APPOINTMENT_COLORS.surfaceTint }}
          >
            <Feather name="x" size={16} color={APPOINTMENT_COLORS.mutedText} />
          </Pressable>
        </View>
        <View style={{ height: 1, backgroundColor: APPOINTMENT_COLORS.divider }} />
      </>
    )}
  >
    {options.length === 0 ? (
      <View className="items-center px-6 py-8">
        <MaterialCommunityIcons
          name="calendar-remove-outline"
          size={26}
          color={APPOINTMENT_COLORS.mutedText}
        />
        <Text
          className="mt-2 text-center"
          style={{ fontSize: 13.5, color: APPOINTMENT_COLORS.mutedText }}
        >
          {emptyText}
        </Text>
      </View>
    ) : (
      <ScrollView style={SHEET_SCROLL_STYLE} bounces={false} showsVerticalScrollIndicator={false}>
        {options.map((option, index) => (
          <SelectOptionRow
            key={option.id}
            option={option}
            isSelected={option.id === value}
            isLast={index === options.length - 1}
            onSelect={onSelect}
          />
        ))}
      </ScrollView>
    )}
  </BottomSheet>
);

export default SelectOptionSheet;
