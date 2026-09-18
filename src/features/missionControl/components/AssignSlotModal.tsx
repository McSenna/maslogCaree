import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
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
  // Closing mid-save would leave the slot half-assigned.
  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      accessibilityLabel={mode === "assign" ? "Assign to slot" : "Reschedule"}
      surface="#FFFFFF"
      handleColor="#CBD5E1"
      header={() => (
        <View className="border-b border-slate-200 px-4 pb-3 pt-1">
          <Text accessibilityRole="header" className="text-lg font-bold text-slate-900">
            {mode === "assign" ? "Assign to slot" : "Reschedule"}
          </Text>
          <Text className="text-sm text-slate-600">
            Mission: {mission ? new Date(mission.date).toLocaleDateString() : "—"}
          </Text>
        </View>
      )}
    >
      {/*
        One scroll region for the whole body. The category and slot lists used
        to be their own bounded ScrollViews, which fought the sheet's drag
        gesture and each other; as plain rows they scroll with everything else.
      */}
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-xs font-semibold text-slate-600">Category for slot</Text>
        <View className="mt-1">
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
        </View>

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
        <View className="mt-1">
          {slots.length === 0 ? (
            <Text className="py-2 text-sm text-slate-500">
              {loadingSlots ? "Loading slots…" : "No slots loaded yet."}
            </Text>
          ) : (
            slots.map((slot) => (
              <Pressable
                key={slot}
                onPress={() => onSelectSlot(slot)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedSlot === slot }}
                className={`mb-1 rounded-lg border px-2 py-2 ${
                  selectedSlot === slot ? "border-mc-primary bg-blue-50" : "border-slate-100"
                }`}
              >
                <Text>{formatSlotLabel(slot)}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* Pinned so Confirm stays reachable however long the slot list runs. */}
      <View className="flex-row gap-2 border-t border-slate-200 px-4 pb-1 pt-3">
        <Pressable
          onPress={handleClose}
          disabled={saving}
          accessibilityRole="button"
          className="flex-1 items-center rounded-xl border border-slate-300 py-3"
          style={{ opacity: saving ? 0.5 : 1 }}
        >
          <Text>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={onSubmit}
          disabled={saving}
          accessibilityRole="button"
          className="flex-1 items-center rounded-xl bg-mc-primary py-3"
          style={{ opacity: saving ? 0.8 : 1 }}
        >
          <Text className="font-semibold text-white">{saving ? "Saving…" : "Confirm"}</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

export default AssignSlotModal;
