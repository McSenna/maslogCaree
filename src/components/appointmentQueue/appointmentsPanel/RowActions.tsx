import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AppointmentRecord } from "@/services/appointments";
import { QUEUE_RADIUS, useQueuePalette, type QueuePalette } from "../queueTheme";

export type RowActionProps = {
  appointment: AppointmentRecord;
  /**
   * Omitted by a read-only queue.
   *
   * Optional rather than a no-op the caller has to invent: a screen whose
   * `canAct` is false never draws a control that could call these, so
   * requiring the handlers would only ask it to supply functions that can
   * never run.
   */
  onApprove?: (appointment: AppointmentRecord) => void;
  onMore?: (appointment: AppointmentRecord) => void;
  busyId: string | null;
  /** False for a role that may read this queue but not act on it. */
  canAct: boolean;
  /**
   * Opening the row itself. Set for a completed row, whose record is the
   * point of it; unset elsewhere, where a row has nothing behind it to show.
   */
  onRowPress?: (appointment: AppointmentRecord) => void;
};

function ApproveButton({
  onPress,
  palette,
  busy,
}: {
  onPress: () => void;
  palette: QueuePalette;
  busy: boolean;
}) {
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
}

function MoreButton({
  onPress,
  palette,
  label,
}: {
  onPress: () => void;
  palette: QueuePalette;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      // A 20px glyph carried to a 44px touch target.
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
}

/** The controls on one appointment row, in a table or on a card. */
export default function RowActions({
  appointment,
  onApprove,
  onMore,
  busyId,
  canAct,
}: RowActionProps) {
  const palette = useQueuePalette();

  // A read-only queue shows no controls at all, rather than controls the API
  // would refuse.
  if (!canAct) return null;

  return (
    <View className="flex-row items-center gap-2">
      {/* Approve only where it means something: a request that has not yet
          been given a slot. Anything already scheduled is changed through the
          menu, not re-approved. */}
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
}
