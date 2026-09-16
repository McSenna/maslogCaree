import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import type { ConsultationCategory, MissionScheduleRecord } from "@/services/appointments";
import type { AssignMode } from "../hooks/useSlotAssignment";
import { formatSlotLabel } from "../utils/slotLabels";

type AssignSlotModalProps = {
  visible: boolean;
  mode: AssignMode;
  mission: MissionScheduleRecord | null;
  categories: ConsultationCategory[];
  categoryKey: string;
  onCategoryChange: (categoryKey: string) => void;
  duration: string;
  onDurationChange: (duration: string) => void;
  slots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  loadingSlots: boolean;
  saving: boolean;
  onLoadSlots: () => void;
  onClose: () => void;
  onSubmit: () => void;
};

const allowsCustomDuration = (
  categories: ConsultationCategory[],
  categoryKey: string
): boolean => {
  const category = categories.find((entry) => entry.key === categoryKey);
  return (
    category?.durationMinutesMin != null ||
    categoryKey === "general_checkup" ||
    categoryKey === "consultation"
  );
};

const AssignSlotModal = ({
  visible,
  mode,
  mission,
  categories,
  categoryKey,
  onCategoryChange,
  duration,
  onDurationChange,
  slots,
  selectedSlot,
  onSelectSlot,
  loadingSlots,
  saving,
  onLoadSlots,
  onClose,
  onSubmit,
}: AssignSlotModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[85%] rounded-t-3xl bg-white p-4">
          <Text className="text-lg font-bold text-slate-900">
            {mode === "assign" ? "Assign to slot" : "Reschedule"}
          </Text>
          <Text className="text-sm text-slate-600">
            Mission: {mission ? new Date(mission.date).toLocaleDateString() : "—"}
          </Text>

          <Text className="mt-3 text-xs font-semibold text-slate-600">Category for slot</Text>
          <ScrollView className="max-h-32 mt-1">
            {categories.map((category) => (
              <Pressable
                key={category.key}
                onPress={() => onCategoryChange(category.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: categoryKey === category.key }}
                className={`rounded-lg px-2 py-2 ${categoryKey === category.key ? "bg-blue-100" : ""}`}
              >
                <Text>{category.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {allowsCustomDuration(categories, categoryKey) && (
            <View className="mt-2">
              <Text className="text-xs text-slate-600">
                Duration (minutes, within allowed range)
              </Text>
              <TextInput
                value={duration}
                onChangeText={onDurationChange}
                keyboardType="number-pad"
                className="mt-1 rounded-xl border border-slate-200 px-3 py-2"
                placeholder="e.g. 20"
              />
            </View>
          )}

          <Pressable
            onPress={onLoadSlots}
            accessibilityRole="button"
            className="mt-3 items-center rounded-xl bg-slate-800 py-2"
          >
            <Text className="font-semibold text-white">
              {loadingSlots ? "Loading slots…" : "Load / refresh available slots"}
            </Text>
          </Pressable>

          <Text className="mt-3 text-xs font-semibold text-slate-600">
            Pick start time (validated)
          </Text>
          <ScrollView className="mt-1 max-h-48">
            {slots.map((slot) => (
              <Pressable
                key={slot}
                onPress={() => onSelectSlot(slot)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedSlot === slot }}
                className={`rounded-lg border px-2 py-2 ${
                  selectedSlot === slot ? "border-mc-primary bg-blue-50" : "border-slate-100"
                }`}
              >
                <Text>{formatSlotLabel(slot)}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View className="mt-4 flex-row gap-2">
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              className="flex-1 items-center rounded-xl border border-slate-300 py-3"
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onSubmit}
              disabled={saving}
              accessibilityRole="button"
              className="flex-1 items-center rounded-xl bg-mc-primary py-3"
            >
              <Text className="font-semibold text-white">{saving ? "Saving…" : "Confirm"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AssignSlotModal;
