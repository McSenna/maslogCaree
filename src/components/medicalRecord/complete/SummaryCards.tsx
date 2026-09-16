import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  QUEUE_RADIUS,
  STATUS_LABELS,
  initialsOf,
  useQueuePalette,
  type QueuePalette,
} from "@/components/appointmentQueue/queueTheme";
import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";
import { patientFactsOf } from "./patientFacts";


const Fact = ({ label, value, palette }: { label: string; value: string; palette: QueuePalette }) => {
  return (
    <View className="min-w-[104px] flex-1 gap-0.5">
      <Text className="text-[10.5px] font-bold uppercase" style={{ color: palette.subtle, letterSpacing: 0.4 }}>
        {label}
      </Text>
      <Text className="text-[13px] font-semibold" style={{ color: palette.heading }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}


const SummaryShell = ({ children, palette }: { children: React.ReactNode; palette: QueuePalette }) => {
  return (
    <View
      className="w-full gap-3 p-3.5"
      style={{
        borderRadius: QUEUE_RADIUS.card,
        borderWidth: 1,
        borderColor: palette.panelBorder,
        backgroundColor: palette.panelBg,
      }}
    >
      {children}
    </View>
  );
};


export const PatientSummaryCard = ({ appointment }: { appointment: AppointmentRecord }) => {
  const palette = useQueuePalette();
  const facts = patientFactsOf(appointment);

  const rows = [
    facts.age ? { label: "Age", value: facts.age } : null,
    facts.sex ? { label: "Sex", value: facts.sex } : null,
    facts.contact ? { label: "Contact", value: facts.contact } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <SummaryShell palette={palette}>
      <View className="flex-row items-center gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: palette.primarySoft }}
        >
          <Text className="text-[15px] font-bold" style={{ color: palette.primary }}>
            {initialsOf(facts.name)}
          </Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[15.5px] font-bold" style={{ color: palette.heading }} numberOfLines={1}>
            {facts.name}
          </Text>
          {facts.email ? (
            <Text className="text-[12px]" style={{ color: palette.muted }} numberOfLines={1}>
              {facts.email}
            </Text>
          ) : null}
        </View>
      </View>

      {rows.length ? (
        <View className="flex-row flex-wrap gap-y-3">
          {rows.map((row) => (
            <Fact key={row.label} label={row.label} value={row.value} palette={palette} />
          ))}
        </View>
      ) : null}
    </SummaryShell>
  );
};


export const AppointmentSummaryCard = ({
  appointment,
  serviceLabel,
  providerName,
}: {
  appointment: AppointmentRecord;
  serviceLabel: string;
  providerName?: string | null;
}) => {
  const palette = useQueuePalette();
  const when = appointment.slotStart ? formatDateTime(appointment.slotStart) : null;
  const status = palette.statuses[appointment.status] ?? palette.statuses.pending;

  const rows = [
    when ? { label: "Date", value: when.date } : null,
    when ? { label: "Time", value: when.time } : null,
    providerName ? { label: "Health worker", value: providerName } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <SummaryShell palette={palette}>
      <View className="flex-row items-center gap-2">
        <View
          className="flex-row items-center gap-1.5 px-2.5 py-1"
          style={{ borderRadius: QUEUE_RADIUS.pill, backgroundColor: palette.primarySoft }}
        >
          <Feather name="activity" size={12} color={palette.primary} />
          <Text className="text-[12px] font-bold" style={{ color: palette.primary }}>
            {serviceLabel}
          </Text>
        </View>

        <View
          className="flex-row items-center gap-1.5 px-2.5 py-1"
          style={{ borderRadius: QUEUE_RADIUS.pill, backgroundColor: status.bg }}
        >
          <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
          <Text className="text-[12px] font-semibold" style={{ color: status.fg }}>
            {STATUS_LABELS[appointment.status]}
          </Text>
        </View>
      </View>

      {rows.length ? (
        <View className="flex-row flex-wrap gap-y-3">
          {rows.map((row) => (
            <Fact key={row.label} label={row.label} value={row.value} palette={palette} />
          ))}
        </View>
      ) : null}
    </SummaryShell>
  );
};
