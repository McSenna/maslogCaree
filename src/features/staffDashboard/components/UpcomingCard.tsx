import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffAppointment } from "@/services/staffDashboardService";
import ServiceBadge from "./ServiceBadge";

const whenLabel = (iso: string | null): string => {
  if (!iso) return "Not scheduled";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Not scheduled";
  const date = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
};

const UpcomingCard = ({
  palette,
  appointments,
  title = "Upcoming Appointments",
  subtitle = "Approved and scheduled after today",
  icon = "calendar",
  emptyMessage = "No appointments scheduled after today.",
  showService,
  limit = 5,
  onViewAll,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  appointments: StaffAppointment[];
  title?: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof PanelCard>["icon"];
  emptyMessage?: string;
  showService: boolean;
  limit?: number;
  onViewAll: () => void;
  fill?: boolean;
}) => {
  const visible = appointments.slice(0, limit);

  return (
    <PanelCard
      palette={palette}
      title={title}
      icon={icon}
      subtitle={subtitle}
      onViewAll={onViewAll}
      fill={fill}
    >
      {visible.length === 0 ? (
        <EmptyPanelState palette={palette} icon={icon ?? "calendar"} message={emptyMessage} />
      ) : (
        <View className="w-full gap-2.5">
          {visible.map((appointment) => (
            <View
              key={appointment._id}
              className="w-full flex-row items-center gap-3"
              accessibilityRole="text"
              accessibilityLabel={`${appointment.patientName}, ${appointment.serviceLabel}, ${whenLabel(appointment.slotStart)}`}
            >
              <View className="min-w-0 flex-1 gap-1">
                <Text
                  className="text-[13.5px] font-semibold"
                  numberOfLines={1}
                  style={{ color: palette.heading }}
                >
                  {appointment.patientName}
                </Text>
                <Text className="text-[12px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
                  {whenLabel(appointment.slotStart)}
                </Text>
              </View>

              {showService ? (
                <ServiceBadge
                  serviceKey={appointment.consultationType}
                  label={appointment.serviceLabel}
                  compact
                />
              ) : null}
            </View>
          ))}
        </View>
      )}
    </PanelCard>
  );
};

export default UpcomingCard;
