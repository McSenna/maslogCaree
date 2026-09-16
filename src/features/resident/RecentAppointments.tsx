import { Text, View } from "react-native";
import DashboardCard from "@/components/resident/DashboardCard";
import SectionHeader from "@/components/resident/SectionHeader";
import { RESIDENT_COLORS } from "@/components/resident/residentTheme";
import type { AppointmentRecord } from "@/services/appointments";
import AppointmentsTable from "./recentAppointments/AppointmentsTable";
import MobileRow from "./recentAppointments/MobileRow";

type RecentAppointmentsProps = {
  appointments: AppointmentRecord[];
  onViewAll: () => void;
  onAppointmentPress: (appointment: AppointmentRecord) => void;
  stacked?: boolean;
};

const RecentAppointments = ({
  appointments,
  onViewAll,
  onAppointmentPress,
  stacked = false,
}: RecentAppointmentsProps) => (
  <DashboardCard>
    <SectionHeader title="Recent Appointments" actionLabel="View All" onActionPress={onViewAll} />

    {appointments.length === 0 ? (
      <View className="items-center py-8">
        <Text className="text-[13px]" style={{ color: RESIDENT_COLORS.muted }}>
          No appointments yet.
        </Text>
      </View>
    ) : stacked ? (
      <View className="mt-3.5 w-full gap-2.5">
        {appointments.map((appointment) => (
          <MobileRow
            key={appointment._id}
            appointment={appointment}
            onPress={() => onAppointmentPress(appointment)}
          />
        ))}
      </View>
    ) : (
      <AppointmentsTable appointments={appointments} onAppointmentPress={onAppointmentPress} />
    )}
  </DashboardCard>
);

export default RecentAppointments;
