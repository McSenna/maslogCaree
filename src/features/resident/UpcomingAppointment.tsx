import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import DashboardCard from "@/components/resident/DashboardCard";
import SectionHeader from "@/components/resident/SectionHeader";
import StatusBadge from "@/components/resident/StatusBadge";
import { CARD, RESIDENT_COLORS } from "@/components/resident/residentTheme";
import { splitAppointmentDate } from "@/data/residentDashboardData";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";
import type { NextAppointment } from "@/services/residentDashboardService";

type UpcomingAppointmentProps = {
  appointment: NextAppointment | null;
  onViewAll: () => void;
  onViewDetails: (appointment: NextAppointment) => void;
  /** Phone layout: the status and button move below the details. */
  stacked?: boolean;
};

/** "10:00 AM" from the stored slot, in the device's own timezone. */
const formatSlotTime = (iso: string | null): string => {
  if (!iso) return "To be scheduled";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "To be scheduled";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const MetaRow = ({ icon, text }: { icon: "person-outline" | "time-outline"; text: string }) => (
  <View className="flex-row items-center gap-1.5">
    <Ionicons name={icon} size={14} color={RESIDENT_COLORS.subtle} />
    <Text className="text-[13px]" numberOfLines={1} style={{ color: RESIDENT_COLORS.muted }}>
      {text}
    </Text>
  </View>
);

const UpcomingAppointment = ({
  appointment,
  onViewAll,
  onViewDetails,
  stacked = false,
}: UpcomingAppointmentProps) => {
  const detailsButton = appointment ? (
    <Pressable
      onPress={() => onViewDetails(appointment)}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${formatConsultationTypeLabel(appointment.consultationType)}`}
      className={`items-center justify-center border px-4 active:opacity-80 ${stacked ? "flex-1" : ""}`}
      style={{
        height: 40,
        borderRadius: 10,
        borderColor: "#BFD6FD",
        backgroundColor: RESIDENT_COLORS.cardBg,
      }}
    >
      <Text className="text-[13px] font-semibold" style={{ color: RESIDENT_COLORS.primary }}>
        View Details
      </Text>
    </Pressable>
  ) : null;

  return (
    <DashboardCard>
      <SectionHeader title="My Upcoming Appointment" actionLabel="View All" onActionPress={onViewAll} />

      {!appointment ? (
        <View className="items-center gap-2 py-8">
          <Ionicons name="calendar-outline" size={22} color={RESIDENT_COLORS.subtle} />
          <Text className="text-[13.5px] font-semibold" style={{ color: RESIDENT_COLORS.heading }}>
            No upcoming appointments
          </Text>
          <Text className="text-center text-[12.5px]" style={{ color: RESIDENT_COLORS.muted }}>
            You don&apos;t have any scheduled appointments yet.
          </Text>
          <Pressable
            onPress={onViewAll}
            accessibilityRole="button"
            accessibilityLabel="Book an appointment"
            className="mt-1 items-center justify-center px-5 active:opacity-85"
            style={{ height: 40, borderRadius: 10, backgroundColor: RESIDENT_COLORS.primary }}
          >
            <Text className="text-[13px] font-semibold text-white">Book Appointment</Text>
          </Pressable>
        </View>
      ) : (
        <View className={`mt-3.5 w-full ${stacked ? "gap-3" : "flex-row items-center gap-4"}`}>
          <View className={stacked ? "flex-row items-center gap-3" : "flex-row items-center gap-4"}>
            {/* Stacked MON / DD / YYYY block */}
            <View
              className="items-center justify-center px-3.5 py-2.5"
              style={{ borderRadius: CARD.radiusSm, backgroundColor: "#EAF2FE" }}
            >
              {(() => {
                const { month, day, year } = splitAppointmentDate(appointment.slotStart ?? "");
                return (
                  <>
                    <Text
                      className="text-[11px] font-bold"
                      style={{ color: RESIDENT_COLORS.primary, letterSpacing: 0.6 }}
                    >
                      {month}
                    </Text>
                    <Text
                      className="text-[24px] font-extrabold"
                      style={{ color: RESIDENT_COLORS.primary, lineHeight: 30 }}
                    >
                      {day}
                    </Text>
                    <Text className="text-[11px] font-medium" style={{ color: RESIDENT_COLORS.primary }}>
                      {year}
                    </Text>
                  </>
                );
              })()}
            </View>

            <View className="min-w-0 flex-1 gap-1.5">
              <Text
                className="text-[15px] font-bold"
                numberOfLines={1}
                style={{ color: RESIDENT_COLORS.heading }}
              >
                {formatConsultationTypeLabel(appointment.consultationType)}
              </Text>
              {appointment.assignedTo ? (
                <MetaRow icon="person-outline" text={appointment.assignedTo} />
              ) : null}
              <MetaRow icon="time-outline" text={formatSlotTime(appointment.slotStart)} />
            </View>
          </View>

          {stacked ? (
            <View className="w-full flex-row items-center gap-2.5">
              <StatusBadge status={appointment.status} />
              {detailsButton}
            </View>
          ) : (
            <View className="shrink-0 items-end gap-2.5">
              <StatusBadge status={appointment.status} />
              {detailsButton}
            </View>
          )}
        </View>
      )}
    </DashboardCard>
  );
};

export default UpcomingAppointment;
