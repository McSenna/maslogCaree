import { Pressable, Text, View } from "react-native";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { CARD, RESIDENT_COLORS } from "@/components/resident/residentTheme";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";
import type { AppointmentRecord } from "@/services/appointments";
import { appointmentDate } from "./appointmentColumns";

const MobileRow = ({
  appointment,
  onPress,
}: {
  appointment: AppointmentRecord;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${formatConsultationTypeLabel(appointment.consultationType)} on ${appointmentDate(appointment)} ${appointment.status}`}
    android_ripple={{ color: "#0B63F612" }}
    className="w-full flex-row items-center gap-3 border p-3 active:opacity-85"
    style={{
      minHeight: 64,
      borderRadius: CARD.radiusSm,
      borderColor: RESIDENT_COLORS.border,
      backgroundColor: RESIDENT_COLORS.cardBg,
    }}
  >
    <View className="min-w-0 flex-1">
      <Text
        className="text-[14px] font-semibold"
        numberOfLines={1}
        style={{ color: RESIDENT_COLORS.heading }}
      >
        {formatConsultationTypeLabel(appointment.consultationType)}
      </Text>
      <Text className="mt-0.5 text-[12.5px]" numberOfLines={1} style={{ color: RESIDENT_COLORS.muted }}>
        {appointmentDate(appointment)}
      </Text>
    </View>
    <AppointmentStatusBadge status={appointment.status} audience="resident" />
  </Pressable>
);

export default MobileRow;
