import { Pressable, Text, View } from "react-native";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { RESIDENT_COLORS } from "@/components/resident/residentTheme";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";
import type { AppointmentRecord } from "@/services/appointments";
import { COLUMNS, appointmentDate } from "./appointmentColumns";

const TableRow = ({
  appointment,
  onPress,
  isLast,
}: {
  appointment: AppointmentRecord;
  onPress: () => void;
  isLast: boolean;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${formatConsultationTypeLabel(appointment.consultationType)} on ${appointmentDate(appointment)}, ${appointment.status}`}
    className="w-full flex-row items-center px-3 active:opacity-70"
    style={{
      minHeight: 44,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: RESIDENT_COLORS.divider,
    }}
  >
    <View style={{ flex: COLUMNS.date, minWidth: 0 }}>
      <Text className="text-[13px]" numberOfLines={1} style={{ color: RESIDENT_COLORS.body }}>
        {appointmentDate(appointment)}
      </Text>
    </View>
    <View style={{ flex: COLUMNS.service, minWidth: 0 }}>
      <Text className="text-[13px]" numberOfLines={1} style={{ color: RESIDENT_COLORS.body }}>
        {formatConsultationTypeLabel(appointment.consultationType)}
      </Text>
    </View>
    <View style={{ flex: COLUMNS.status, minWidth: 0 }}>
      <AppointmentStatusBadge status={appointment.status} audience="resident" />
    </View>
  </Pressable>
);

export default TableRow;
