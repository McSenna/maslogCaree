import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useModalFrame } from "@/hooks/useModalFrame";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import { REG_COLORS } from "../../registration/registrationTheme";
import DatePickerActions from "./DatePickerActions";
import DatePickerPanel from "./DatePickerPanel";
import type { useDateOfBirthDraft } from "./useDateOfBirthDraft";

type DateOfBirthModalProps = {
  visible: boolean;
  draft: ReturnType<typeof useDateOfBirthDraft>;
  onCancel: () => void;
  onConfirm: () => void;
};

const DateOfBirthModal = ({ visible, draft, onCancel, onConfirm }: DateOfBirthModalProps) => {
  const frame = useModalFrame(400);

  useWebModalBehavior(visible, onCancel);
  const attachFocusTrap = useFocusTrap(visible);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          backgroundColor: "rgba(15, 23, 42, 0.45)",
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close date picker"
          onPress={onCancel}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          ref={attachFocusTrap as never}
          accessibilityViewIsModal
          style={{
            width: frame.width,
            maxHeight: frame.maxHeight,
            borderRadius: 20,
            backgroundColor: REG_COLORS.surface,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: REG_COLORS.border,
            }}
          >
            <Text
              accessibilityRole="header"
              style={{ flex: 1, fontSize: 17, fontWeight: "800", color: REG_COLORS.text }}
            >
              Select Date of Birth
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onCancel}
              hitSlop={8}
              style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}
            >
              <Feather name="x" size={19} color={REG_COLORS.muted} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ padding: 20, gap: 18 }}
            showsVerticalScrollIndicator={false}
          >
            <DatePickerPanel draft={draft} cellSize={44} />
            <DatePickerActions
              onCancel={onCancel}
              onConfirm={onConfirm}
              canConfirm={Boolean(draft.selected)}
              height={46}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DateOfBirthModal;
