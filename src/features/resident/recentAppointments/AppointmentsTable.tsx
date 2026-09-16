import { Text, View } from "react-native";
import { RESIDENT_COLORS } from "@/components/resident/residentTheme";
import type { AppointmentRecord } from "@/services/appointments";
import { COLUMNS } from "./appointmentColumns";
import TableRow from "./TableRow";

const AppointmentsTable = ({
  appointments,
  onAppointmentPress,
}: {
  appointments: AppointmentRecord[];
  onAppointmentPress: (appointment: AppointmentRecord) => void;
}) => (
  <View className="mt-3.5 w-full">
    <View
      className="w-full flex-row items-center px-3"
      style={{
        minHeight: 38,
        borderRadius: 8,
        backgroundColor: "#F7FAFF",
      }}
    >
      <Text
        accessibilityRole="header"
        className="text-[12.5px] font-semibold"
        style={{ flex: COLUMNS.date, color: RESIDENT_COLORS.muted }}
      >
        Date
      </Text>
      <Text
        accessibilityRole="header"
        className="text-[12.5px] font-semibold"
        style={{ flex: COLUMNS.service, color: RESIDENT_COLORS.muted }}
      >
        Service
      </Text>
      <Text
        accessibilityRole="header"
        className="text-[12.5px] font-semibold"
        style={{ flex: COLUMNS.status, color: RESIDENT_COLORS.muted }}
      >
        Status
      </Text>
    </View>

    {appointments.map((appointment, index) => (
      <TableRow
        key={appointment._id}
        appointment={appointment}
        isLast={index === appointments.length - 1}
        onPress={() => onAppointmentPress(appointment)}
      />
    ))}
  </View>
);

export default AppointmentsTable;
