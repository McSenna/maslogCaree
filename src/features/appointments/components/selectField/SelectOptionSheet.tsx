import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";

import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "../appointmentTheme";
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
}: Props) => {
  const { height } = useWindowDimensions();

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,37,87,0.4)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Close ${label.toLowerCase()} picker`}
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: APPOINTMENT_COLORS.white,
            borderTopLeftRadius: APPOINTMENT_METRICS.radiusSheet,
            borderTopRightRadius: APPOINTMENT_METRICS.radiusSheet,
            paddingBottom: 18,
            maxHeight: Math.max(height * 0.7, 280),
          }}
        >
          <View className="items-center pt-3">
            <View
              style={{
                width: 42,
                height: 4,
                borderRadius: 2,
                backgroundColor: APPOINTMENT_COLORS.track,
              }}
            />
          </View>

          <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
            <Text
              accessibilityRole="header"
              style={{ fontSize: 16, fontWeight: "700", color: APPOINTMENT_COLORS.primaryDeep }}
            >
              {sheetTitle ?? label}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: APPOINTMENT_COLORS.surfaceTint }}
            >
              <Feather name="x" size={16} color={APPOINTMENT_COLORS.mutedText} />
            </Pressable>
          </View>

          <View style={{ height: 1, backgroundColor: APPOINTMENT_COLORS.divider }} />

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
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
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
        </View>
      </View>
    </Modal>
  );
};

export default SelectOptionSheet;
