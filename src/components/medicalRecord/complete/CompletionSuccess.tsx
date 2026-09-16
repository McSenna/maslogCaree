import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { InventoryMovement } from "@/services/medicalRecords";

const CompletionSuccess = ({
  patientName,
  serviceLabel,
  movements,
  canViewRecord,
  onViewRecord,
  onClose,
}: {
  patientName: string;
  serviceLabel: string;
  movements: InventoryMovement[];
  canViewRecord: boolean;
  onViewRecord: () => void;
  onClose: () => void;
}) => {
  const palette = useQueuePalette();
  const green = palette.tones.green;

  const outcomes = [
    `${serviceLabel} record saved to ${patientName}'s medical history.`,
    "Appointment marked as completed and removed from the active queue.",
    movements.length
      ? `Inventory updated — ${movements.length} ${movements.length === 1 ? "item" : "items"} deducted.`
      : null,
  ].filter(Boolean) as string[];

  return (
    <View className="w-full items-center gap-5 py-4">
      <View
        className="h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: green.bg }}
      >
        <Feather name="check" size={30} color={green.fg} />
      </View>

      <View className="items-center gap-1.5">
        <Text accessibilityRole="header" className="text-center text-[18px] font-bold" style={{ color: palette.heading }}>
          Appointment completed
        </Text>
        <Text className="text-center text-[13px] leading-[19px]" style={{ color: palette.muted }}>
          The medical record was saved successfully.
        </Text>
      </View>

      <View
        className="w-full gap-2.5 p-3.5"
        style={{
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.panelBorder,
          backgroundColor: palette.rowHover,
        }}
      >
        {outcomes.map((line) => (
          <View key={line} className="flex-row items-start gap-2.5">
            <Feather name="check-circle" size={14} color={green.fg} style={{ marginTop: 1.5 }} />
            <Text className="min-w-0 flex-1 text-[12.5px] leading-[18px]" style={{ color: palette.body }}>
              {line}
            </Text>
          </View>
        ))}
      </View>

      <View className="w-full flex-row gap-2.5">
        {canViewRecord ? (
          <Pressable
            onPress={onViewRecord}
            accessibilityRole="button"
            accessibilityLabel="View the medical record that was just saved"
            className="h-11 flex-1 items-center justify-center"
            style={{
              borderRadius: QUEUE_RADIUS.control,
              borderWidth: 1,
              borderColor: palette.panelBorder,
            }}
          >
            <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
              View Record
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Return to the queue"
          className="h-11 items-center justify-center px-5"
          style={{
            flex: 1.2,
            borderRadius: QUEUE_RADIUS.control,
            backgroundColor: palette.primary,
          }}
        >
          <Text className="text-[14px] font-semibold text-white">Return to Queue</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CompletionSuccess;
