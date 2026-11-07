import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import Card from "@/components/cards/Card";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { AppointmentRecord } from "@/services/appointments";
import { webTransition } from "@/theme/motion";
import { SHADOWS } from "@/theme/shadows";
import { webStyle } from "@/theme/webStyle";
import {
  appointmentServiceLabel,
  appointmentSubline,
  appointmentWhen,
  canCancelAppointment,
  canRescheduleAppointment,
  medicalRecordIdOf,
  residentStatusLabel,
} from "../appointmentPresenter";
import { AppointmentCardActions } from "./AppointmentCardActions";

export type AppointmentCardProps = {
  appointment: AppointmentRecord;
  palette: QueuePalette;
  onOpen: (appointment: AppointmentRecord) => void;
  onReschedule?: (appointment: AppointmentRecord) => void;
  onCancel?: (appointment: AppointmentRecord) => void;
  onOpenMedicalRecord?: (recordId: string, appointment: AppointmentRecord) => void;
};

const SUMMARY_WEB = webStyle({ cursor: "pointer", outlineStyle: "none" });
const CARD_WEB = webStyle({ transition: webTransition("border-color", "box-shadow") });

/**
 * One appointment. The card is a plain surface holding two siblings: the
 * summary, which is the button that opens the details, and the action strip.
 * The card used to be the button itself, which put Reschedule and Cancel
 * inside a button: invalid on web, and unreachable for screen readers. Hover,
 * focus and press still light up the whole card.
 */
const AppointmentCard = ({
  appointment,
  palette,
  onOpen,
  onReschedule,
  onCancel,
  onOpenMedicalRecord,
}: AppointmentCardProps) => {
  const visual = resolveVisual(getServiceVisual(appointment.consultationType), palette.isDark);
  const service = appointmentServiceLabel(appointment);
  const status = residentStatusLabel(appointment.status);
  const when = appointmentWhen(appointment);
  const recordId = medicalRecordIdOf(appointment);
  const showReschedule = Boolean(onReschedule) && canRescheduleAppointment(appointment);
  const showCancel = Boolean(onCancel) && canCancelAppointment(appointment);

  const colors = useThemeColors();
  const summary = useInteractionState({ pressScale: 0.985 });
  const [detailsHovered, setDetailsHovered] = useState(false);
  const hovered = summary.hovered || detailsHovered;
  const emphasised = hovered || summary.focused || summary.pressed;
  const subline = appointmentSubline(appointment);
  const summaryRef = useRef<View>(null);
  // "Details" is hidden from assistive tech, so closing the sheet must not
  // return focus to it: the card's own open button takes focus first.
  const openFromDetails = () => {
    summaryRef.current?.focus?.();
    onOpen(appointment);
  };

  return (
    <Animated.View style={summary.scaleStyle}>
      <Card
        elevated={false}
        style={[
          { width: "100%", gap: 12 },
          CARD_WEB,
          emphasised ? { borderColor: colors.primary } : null,
          hovered ? SHADOWS.raised : null,
          summary.focused ? { outlineWidth: 3, outlineColor: colors.focusRing, outlineStyle: "solid", outlineOffset: 2 } : null,
        ]}
      >
        <Pressable
          ref={summaryRef}
          {...summary.handlers}
          onPress={() => onOpen(appointment)}
          accessibilityRole="button"
          accessibilityLabel={`${service}, ${status}, ${when}.${recordId ? " Medical record available." : ""}`}
          accessibilityHint="Opens the appointment details"
          className="w-full gap-3"
          style={SUMMARY_WEB}
        >
          <View className="w-full flex-row items-start gap-3">
            <View
              className="items-center justify-center"
              style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: visual.tint }}
            >
              <MaterialCommunityIcons name={visual.icon} size={20} color={visual.fg} />
            </View>

            <View className="min-w-0 flex-1 gap-1">
              <Text className="text-[16.5px] font-bold" style={{ color: palette.heading }} numberOfLines={1}>
                {service}
              </Text>
              <Text className="text-[14.5px]" style={{ color: palette.muted }} numberOfLines={1}>
                {when}
              </Text>
            </View>

            <AppointmentStatusBadge status={appointment.status} audience="resident" />
          </View>

          {subline ? (
            <Text className="text-[15px] leading-[21px]" style={{ color: palette.body }} numberOfLines={2}>
              {subline}
            </Text>
          ) : null}
        </Pressable>

        <AppointmentCardActions
          appointment={appointment}
          palette={palette}
          onOpenDetails={openFromDetails}
          onReschedule={onReschedule}
          onCancel={onCancel}
          onOpenMedicalRecord={onOpenMedicalRecord}
          recordId={recordId}
          showReschedule={showReschedule}
          showCancel={showCancel}
          onDetailsHover={setDetailsHovered}
        />
      </Card>
    </Animated.View>
  );
};

export default AppointmentCard;
