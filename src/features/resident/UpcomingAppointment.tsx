import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { NextAppointment } from "@/services/residentDashboardService";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";

type UpcomingAppointmentProps = {
  palette: AdminDashboardPalette;
  appointment: NextAppointment | null;
  onViewAll: () => void;
  onViewDetails: (appointment: NextAppointment) => void;
  onBook: () => void;
  compact?: boolean;
  fill?: boolean;
};

const parse = (iso: string | null): Date | null => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "Today", "Tomorrow", "In 5 days", or the weekday name further out. */
const relativeDay = (date: Date, now: Date = new Date()): string => {
  const startOf = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const days = Math.round((startOf(date) - startOf(now)) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  return date.toLocaleDateString(undefined, { weekday: "long" });
};

const DateTile = ({ palette, date }: { palette: AdminDashboardPalette; date: Date | null }) => (
  <View
    className="shrink-0 items-center justify-center"
    style={{ width: 76, height: 84, borderRadius: 14, backgroundColor: palette.tones.blue.cardBg, borderWidth: 1, borderColor: palette.tones.blue.cardBorder }}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  >
    {date ? (
      <>
        <Text className="text-[12px] font-bold" style={{ color: palette.primary, letterSpacing: 0.4 }}>
          {date.toLocaleDateString(undefined, { month: "short" })}
        </Text>
        <Text className="text-[28px] font-bold" style={{ color: palette.heading, lineHeight: 32, fontVariant: ["tabular-nums"] }}>
          {date.getDate()}
        </Text>
        <Text className="text-[12px] font-semibold" style={{ color: palette.muted }}>
          {date.toLocaleDateString(undefined, { weekday: "short" })}
        </Text>
      </>
    ) : (
      <Feather name="calendar" size={24} color={palette.primary} />
    )}
  </View>
);

const Meta = ({ palette, icon, text }: { palette: AdminDashboardPalette; icon: keyof typeof Feather.glyphMap; text: string }) => (
  <View className="flex-row items-center gap-1.5">
    <Feather name={icon} size={14} color={palette.subtle} />
    <Text className="text-[13.5px]" numberOfLines={1} style={{ color: palette.body }}>
      {text}
    </Text>
  </View>
);

const UpcomingAppointment = ({
  palette,
  appointment,
  onViewAll,
  onViewDetails,
  onBook,
  compact = false,
  fill = false,
}: UpcomingAppointmentProps) => {
  const date = parse(appointment?.slotStart ?? null);
  const service = appointment ? formatConsultationTypeLabel(appointment.consultationType) : "";
  const time = date?.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <PanelCard
      palette={palette}
      title="Next appointment"
      icon="clock"
      subtitle={date ? relativeDay(date) : appointment ? "Waiting for a slot" : "Nothing booked"}
      onViewAll={onViewAll}
      viewAllLabel="All"
      fill={fill}
      centerContent={!appointment}
    >
      {!appointment ? (
        <View className="items-center gap-3 pb-2">
          <EmptyPanelState palette={palette} icon="calendar" message="You have no upcoming appointments." />
          <DashboardButton palette={palette} variant="primary" size="md" icon="plus" label="Book appointment" onPress={onBook} />
        </View>
      ) : (
        <View className="gap-4">
          <View className="flex-row items-center gap-4">
            <DateTile palette={palette} date={date} />
            <View className="min-w-0 flex-1 gap-1.5">
              <Text
                className="text-[17px] font-bold"
                numberOfLines={2}
                style={{ color: palette.heading, lineHeight: 22 }}
                accessibilityLabel={`${service}${date ? ` on ${date.toDateString()} at ${time}` : ", not scheduled yet"}`}
              >
                {service}
              </Text>
              <Meta palette={palette} icon="clock" text={time ?? "Time to be set"} />
              {appointment.assignedTo ? <Meta palette={palette} icon="user" text={appointment.assignedTo} /> : null}
              <View className="mt-1 self-start">
                <AppointmentStatusBadge status={appointment.status} audience="resident" size="md" />
              </View>
            </View>
          </View>

          <View className={compact ? "gap-2" : "flex-row items-center gap-2"}>
            <DashboardButton
              palette={palette}
              variant="secondary"
              size="md"
              fullWidth={compact}
              label="View details"
              trailingIcon="arrow-right"
              onPress={() => onViewDetails(appointment)}
              accessibilityLabel={`View details for ${service}`}
            />
          </View>
        </View>
      )}
    </PanelCard>
  );
};

export default UpcomingAppointment;
