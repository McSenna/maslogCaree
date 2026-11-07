import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Pressable, Text, View } from "react-native";

import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { AppointmentRecord } from "@/services/appointments";
import { PALETTE, withAlpha } from "@/theme/palette";
import { webStyle } from "@/theme/webStyle";

type Props = {
  appointment: AppointmentRecord;
  palette: QueuePalette;
  /** Opens the details from the pointer-only "Details" link. */
  onOpenDetails: () => void;
  onReschedule?: (appointment: AppointmentRecord) => void;
  onCancel?: (appointment: AppointmentRecord) => void;
  onOpenMedicalRecord?: (recordId: string, appointment: AppointmentRecord) => void;
  recordId: string | null;
  showReschedule: boolean;
  showCancel: boolean;
  /** Hover on "Details" lights the card, like hovering its summary. */
  onDetailsHover: (hovered: boolean) => void;
};

const POINTER = webStyle({ cursor: "pointer" });

const chipStyle = (background: string, border: string) => ({
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 4,
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
  backgroundColor: background,
  borderWidth: 1,
  borderColor: border,
});

// "Details" repeats the card's own open button for pointer users, so it is
// kept out of the tab order and the accessibility tree: one stop per action.
const HIDDEN_FROM_ASSISTIVE_TECH = {
  accessibilityElementsHidden: true,
  importantForAccessibility: "no-hide-descendants" as const,
  focusable: false,
  ...Platform.select({ web: { "aria-hidden": true, tabIndex: -1 } as object }),
};

/**
 * The strip under an appointment card. Each action is its own button beside
 * the card's open button, never inside it (a button may not hold a button).
 */
export const AppointmentCardActions = ({
  appointment,
  palette,
  onOpenDetails,
  onReschedule,
  onCancel,
  onOpenMedicalRecord,
  recordId,
  showReschedule,
  showCancel,
  onDetailsHover,
}: Props) => {
  const softBorder = palette.isDark ? withAlpha(PALETTE.blue[400], 0.4) : PALETTE.blue[200];
  const showRecord = appointment.status === "completed" && recordId && onOpenMedicalRecord;
  // red 700 on the dark tint was 2.2:1; red 300 reads at well over 4.5:1 there.
  const cancelInk = palette.isDark ? PALETTE.red[300] : PALETTE.red[700];

  return (
    <View
      className="w-full flex-row flex-wrap items-center justify-between gap-2 pt-3"
      style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
    >
      <View className="flex-row flex-wrap items-center gap-2">
        {showRecord ? (
          <Pressable
            onPress={() => onOpenMedicalRecord(recordId, appointment)}
            accessibilityRole="button"
            accessibilityLabel="View Medical Details"
            style={[chipStyle(palette.primarySoft, softBorder), POINTER]}
          >
            <MaterialCommunityIcons name="clipboard-pulse-outline" size={14} color={palette.primary} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: palette.primary }}>View Medical Details</Text>
          </Pressable>
        ) : null}

        {showReschedule && onReschedule ? (
          <Pressable
            onPress={() => onReschedule(appointment)}
            accessibilityRole="button"
            accessibilityLabel="Reschedule appointment"
            style={[chipStyle(palette.primarySoft, softBorder), POINTER]}
          >
            <Feather name="calendar" size={13} color={palette.primary} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: palette.primary }}>Reschedule</Text>
          </Pressable>
        ) : null}

        {showCancel && onCancel ? (
          <Pressable
            onPress={() => onCancel(appointment)}
            accessibilityRole="button"
            accessibilityLabel="Cancel appointment"
            style={[
              chipStyle(
                palette.isDark ? withAlpha(PALETTE.red[500], 0.12) : PALETTE.red[50],
                palette.isDark ? withAlpha(PALETTE.red[500], 0.3) : PALETTE.red[200]
              ),
              POINTER,
            ]}
          >
            <Feather name="x-circle" size={13} color={palette.isDark ? cancelInk : PALETTE.red[600]} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: cancelInk }}>Cancel</Text>
          </Pressable>
        ) : null}
      </View>

      <Pressable
        onPress={onOpenDetails}
        onHoverIn={() => onDetailsHover(true)}
        onHoverOut={() => onDetailsHover(false)}
        className="ml-auto flex-row items-center gap-1"
        style={POINTER}
        {...HIDDEN_FROM_ASSISTIVE_TECH}
      >
        <Text className="text-[14.5px] font-semibold" style={{ color: palette.primary }}>
          Details
        </Text>
        <Feather name="chevron-right" size={15} color={palette.primary} />
      </Pressable>
    </View>
  );
};

export default AppointmentCardActions;
