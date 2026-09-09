import { Pressable, Text, View } from "react-native";
import DashboardCard from "@/components/resident/DashboardCard";
import SectionHeader from "@/components/resident/SectionHeader";
import StatusBadge from "@/components/resident/StatusBadge";
import { CARD, RESIDENT_COLORS } from "@/components/resident/residentTheme";
import { formatAppointmentDate } from "@/data/residentDashboardData";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";
import type { AppointmentRecord } from "@/services/appointments";

type RecentAppointmentsProps = {
  appointments: AppointmentRecord[];
  onViewAll: () => void;
  onAppointmentPress: (appointment: AppointmentRecord) => void;
  /** Phone layout: cards instead of the desktop's column table. */
  stacked?: boolean;
};

/** The slot the visit was given, or when it was requested if it has none yet. */
const appointmentDate = (appointment: AppointmentRecord): string =>
  formatAppointmentDate(appointment.slotStart ?? appointment.createdAt ?? "");

/** Column weights, shared by the header and the rows so they cannot drift. */
const COLUMNS = { date: 1.15, service: 1.5, status: 1 } as const;

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
      <StatusBadge status={appointment.status} compact />
    </View>
  </Pressable>
);

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
    <StatusBadge status={appointment.status} compact />
  </Pressable>
);

/**
 * Recent appointment history.
 *
 * Desktop draws the design's three-column table — built from View/Text rather
 * than an HTML table, since this renders on native as well as the web. The
 * phone gets cards: three columns at 360px would clip the service name, which
 * is the column a resident actually scans for.
 */
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
      <View className="mt-3.5 w-full">
        {/* Header strip */}
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
    )}
  </DashboardCard>
);

export default RecentAppointments;
