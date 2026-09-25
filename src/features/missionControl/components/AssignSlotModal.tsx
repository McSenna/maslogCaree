import { ScrollView, Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { MissionScheduleRecord } from "@/services/appointments";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

import type { AssignMode } from "../hooks/useSlotAssignment";
import AssignSlotBody, { type AssignSlotBodyProps } from "./assignSlot/AssignSlotBody";

type AssignSlotModalProps = AssignSlotBodyProps & {
  visible: boolean;
  mode: AssignMode;
  mission: MissionScheduleRecord | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const AssignSlotModal = ({ visible, mode, mission, saving, onClose, onSubmit, ...body }: AssignSlotModalProps) => {
  const colors = useThemeColors();
  const title = mode === "assign" ? "Assign to slot" : "Reschedule";

  // Closing mid-save would leave the slot half-assigned.
  const handleClose = () => {
    if (!saving) onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      onDismissRequest={() => saving}
      accessibilityLabel={title}
      surface={colors.surface}
      handleColor={colors.borderStrong}
      header={() => (
        <View
          style={{
            paddingHorizontal: SPACING.lg,
            paddingBottom: SPACING.md,
            paddingTop: SPACING.xs,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}
        >
          <Text accessibilityRole="header" style={[TYPE.title, { color: colors.heading }]}>
            {title}
          </Text>
          <Text style={[TYPE.body, { color: colors.muted }]}>
            Mission: {mission ? new Date(mission.date).toLocaleDateString() : "—"}
          </Text>
        </View>
      )}
      footer={
        <View
          style={{
            flexDirection: "row",
            gap: SPACING.sm,
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.md,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
          }}
        >
          <Button variant="secondary" label="Cancel" onPress={handleClose} disabled={saving} fullWidth style={{ flex: 1 }} />
          <Button
            label="Confirm"
            loadingLabel="Saving…"
            loading={saving}
            disabled={!body.selectedSlot}
            onPress={onSubmit}
            fullWidth
            style={{ flex: 1 }}
          />
        </View>
      }
    >
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={{ padding: SPACING.lg }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AssignSlotBody {...body} />
      </ScrollView>
    </BottomSheet>
  );
};

export default AssignSlotModal;
