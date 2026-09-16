import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AppointmentRecord } from "@/services/appointments";
import { QUEUE_RADIUS, useQueuePalette, type QueuePalette } from "../queueTheme";

export type RowActionProps = {
  appointment: AppointmentRecord;
  onApprove?: (appointment: AppointmentRecord) => void;
  onMore?: (appointment: AppointmentRecord) => void;
  busyId: string | null;
  canAct: boolean;
  onRowPress?: (appointment: AppointmentRecord) => void;
};

const ApproveButton = ({
  onPress,
  palette,
  busy,
}: {
  onPress: () => void;
  palette: QueuePalette;
  busy: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel="Approve this appointment"
      className="h-9 items-center justify-center px-4"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        backgroundColor: palette.primary,
        opacity: busy ? 0.55 : hovered ? 0.9 : 1,
      }}
    >
      <Text className="text-[13px] font-semibold text-white">Approve</Text>
    </Pressable>
  );
};

const MoreButton = ({
  onPress,
  palette,
  label,
}: {
  onPress: () => void;
  palette: QueuePalette;
  label: string;
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={12}
      className="h-9 w-9 items-center justify-center"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        borderWidth: 1,
        borderColor: palette.panelBorder,
      }}
    >
      <Feather name="more-horizontal" size={18} color={palette.muted} />
    </Pressable>
  );
};

const RowActions = ({
  appointment,
  onApprove,
  onMore,
  busyId,
  canAct,
}: RowActionProps) => {
  const palette = useQueuePalette();

  if (!canAct) return null;

  return (
    <View className="flex-row items-center gap-2">
      {appointment.status === "pending" ? (
        <ApproveButton
          onPress={() => onApprove?.(appointment)}
          palette={palette}
          busy={busyId === appointment._id}
        />
      ) : null}
      <MoreButton
        onPress={() => onMore?.(appointment)}
        palette={palette}
        label={`More actions for ${appointment.resident?.fullname ?? "this appointment"}`}
      />
    </View>
  );
};

export default RowActions;
