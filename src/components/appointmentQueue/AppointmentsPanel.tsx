import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";
import QueuePanel from "./QueuePanel";
import StatusBadge from "./StatusBadge";
import {
  QUEUE_RADIUS,
  STATUS_LABELS,
  STATUS_ORDER,
  initialsOf,
  useQueuePalette,
  type AppointmentStatus,
  type QueuePalette,
} from "./queueTheme";

/** Column weights, shared by the header and the rows so they cannot drift. */
const COLUMNS = { index: 54, patient: 2.4, service: 1.6, date: 1.3, time: 1, status: 1.1, action: 132 };

function Avatar({ name, palette }: { name: string; palette: QueuePalette }) {
  return (
    <View
      className="h-9 w-9 items-center justify-center rounded-full"
      style={{ backgroundColor: palette.primarySoft }}
    >
      <Text className="text-[12px] font-bold" style={{ color: palette.primary }}>
        {initialsOf(name)}
      </Text>
    </View>
  );
}

function ApproveButton({
  onPress,
  palette,
  busy,
}: {
  onPress: () => void;
  palette: QueuePalette;
  busy: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel="Approve this appointment"
      className="h-9 items-center justify-center px-4"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        backgroundColor: palette.primary,
        opacity: busy ? 0.55 : hovered ? 0.9 : 1,
      }}
    >
      <Text className="text-[13px] font-semibold text-white">Approve</Text>
    </Pressable>
  );
}

function MoreButton({
  onPress,
  palette,
  label,
}: {
  onPress: () => void;
  palette: QueuePalette;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      // A 20px glyph carried to a 44px touch target.
      hitSlop={12}
      className="h-9 w-9 items-center justify-center"
      style={{ borderRadius: QUEUE_RADIUS.control, borderWidth: 1, borderColor: palette.panelBorder }}
    >
      <Feather name="more-horizontal" size={18} color={palette.muted} />
    </Pressable>
  );
}

type RowActionProps = {
  appointment: AppointmentRecord;
  onApprove: (appointment: AppointmentRecord) => void;
  onMore: (appointment: AppointmentRecord) => void;
  busyId: string | null;
  /** False for a role that may read this queue but not act on it. */
  canAct: boolean;
};

function RowActions({ appointment, onApprove, onMore, busyId, canAct }: RowActionProps) {
  const palette = useQueuePalette();

  // A read-only queue shows no controls at all, rather than controls the API
  // would refuse.
  if (!canAct) return null;

  return (
    <View className="flex-row items-center gap-2">
      {/* Approve only where it means something: a request that has not yet
          been given a slot. Anything already scheduled is changed through the
          menu, not re-approved. */}
      {appointment.status === "pending" ? (
        <ApproveButton
          onPress={() => onApprove(appointment)}
          palette={palette}
          busy={busyId === appointment._id}
        />
      ) : null}
      <MoreButton
        onPress={() => onMore(appointment)}
        palette={palette}
        label={`More actions for ${appointment.resident?.fullname ?? "this appointment"}`}
      />
    </View>
  );
}

function Cell({
  children,
  flex,
  width,
}: {
  children: React.ReactNode;
  flex?: number;
  width?: number;
}) {
  return (
    <View className="justify-center px-3" style={{ flex, width, minWidth: 0 }}>
      {children}
    </View>
  );
}

function TableHeader({ palette, canAct }: { palette: QueuePalette; canAct: boolean }) {
  const label = (text: string) => (
    <Text className="text-[12px] font-semibold uppercase" style={{ color: palette.subtle, letterSpacing: 0.4 }}>
      {text}
    </Text>
  );

  return (
    <View
      className="w-full flex-row items-center py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <Cell width={COLUMNS.index}>{label("#")}</Cell>
      <Cell flex={COLUMNS.patient}>{label("Patient Name")}</Cell>
      <Cell flex={COLUMNS.service}>{label("Service")}</Cell>
      <Cell flex={COLUMNS.date}>{label("Date")}</Cell>
      <Cell flex={COLUMNS.time}>{label("Time")}</Cell>
      <Cell flex={COLUMNS.status}>{label("Status")}</Cell>
      {/* No column where there are no controls, rather than a header over an
          empty strip. */}
      {canAct ? <Cell width={COLUMNS.action}>{label("Action")}</Cell> : null}
    </View>
  );
}

function TableRow({
  appointment,
  index,
  serviceLabel,
  isLast,
  palette,
  ...actions
}: RowActionProps & {
  index: number;
  serviceLabel: string;
  isLast: boolean;
  palette: QueuePalette;
}) {
  const [hovered, setHovered] = useState(false);
  const when = appointment.slotStart
    ? formatDateTime(appointment.slotStart)
    : { date: "Not scheduled", time: "—" };

  return (
    <View
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="w-full flex-row items-center"
      style={{
        minHeight: 64,
        backgroundColor: hovered ? palette.pageBg : "transparent",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <Cell width={COLUMNS.index}>
        <Text className="text-[13px] font-semibold" style={{ color: palette.subtle }}>
          {String(index).padStart(3, "0")}
        </Text>
      </Cell>

      <Cell flex={COLUMNS.patient}>
        <View className="flex-row items-center gap-2.5">
          <Avatar name={appointment.resident?.fullname ?? ""} palette={palette} />
          <Text numberOfLines={1} className="min-w-0 flex-1 text-[14px] font-semibold" style={{ color: palette.heading }}>
            {appointment.resident?.fullname || "Unnamed patient"}
          </Text>
        </View>
      </Cell>

      <Cell flex={COLUMNS.service}>
        <Text numberOfLines={1} className="text-[13.5px]" style={{ color: palette.body }}>
          {serviceLabel}
        </Text>
      </Cell>

      <Cell flex={COLUMNS.date}>
        <Text numberOfLines={1} className="text-[13.5px]" style={{ color: palette.body }}>
          {when.date}
        </Text>
      </Cell>

      <Cell flex={COLUMNS.time}>
        <Text numberOfLines={1} className="text-[13.5px]" style={{ color: palette.body }}>
          {when.time}
        </Text>
      </Cell>

      <Cell flex={COLUMNS.status}>
        <StatusBadge status={appointment.status} />
      </Cell>

      {actions.canAct ? (
        <Cell width={COLUMNS.action}>
          <RowActions appointment={appointment} {...actions} />
        </Cell>
      ) : null}
    </View>
  );
}

function AppointmentCard({
  appointment,
  serviceLabel,
  palette,
  ...actions
}: RowActionProps & { serviceLabel: string; palette: QueuePalette }) {
  const when = appointment.slotStart
    ? formatDateTime(appointment.slotStart)
    : { date: "Not scheduled", time: "—" };

  return (
    <View
      className="w-full gap-3 border p-3.5"
      style={{
        borderRadius: QUEUE_RADIUS.card,
        backgroundColor: palette.panelBg,
        borderColor: palette.panelBorder,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Avatar name={appointment.resident?.fullname ?? ""} palette={palette} />
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-[15px] font-bold" style={{ color: palette.heading }}>
            {appointment.resident?.fullname || "Unnamed patient"}
          </Text>
          <Text numberOfLines={1} className="mt-0.5 text-[13px]" style={{ color: palette.muted }}>
            {serviceLabel}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <Feather name="calendar" size={13} color={palette.subtle} />
          <Text className="text-[12.5px]" style={{ color: palette.body }}>{when.date}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Feather name="clock" size={13} color={palette.subtle} />
          <Text className="text-[12.5px]" style={{ color: palette.body }}>{when.time}</Text>
        </View>
      </View>

      <View
        className="flex-row items-center justify-between gap-2 pt-3"
        style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
      >
        <StatusBadge status={appointment.status} />
        <RowActions appointment={appointment} {...actions} />
      </View>
    </View>
  );
}

type AppointmentsPanelProps = {
  appointments: AppointmentRecord[];
  statusCounts: Record<string, number>;
  activeStatus: AppointmentStatus;
  onStatusChange: (status: AppointmentStatus) => void;
  serviceLabels: Record<string, string>;
  /** Rendered in the header — the doctor's Add Mission control, or nothing. */
  headerAction?: React.ReactNode;
  onApprove: (appointment: AppointmentRecord) => void;
  onMore: (appointment: AppointmentRecord) => void;
  busyId: string | null;
  /** False for a role that may read this queue but not act on it. */
  canAct: boolean;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  emptyMessage: string;
  /** Table above this width, cards below it. */
  asTable: boolean;
};

/**
 * The requests this role is responsible for, filtered by standing.
 *
 * A table where there is room for seven columns and cards where there is not —
 * a phone gets a card per appointment rather than a table it has to drag
 * sideways to read.
 */
export default function AppointmentsPanel({
  appointments,
  statusCounts,
  activeStatus,
  onStatusChange,
  serviceLabels,
  headerAction,
  onApprove,
  onMore,
  busyId,
  canAct,
  loading,
  error,
  onRetry,
  emptyMessage,
  asTable,
}: AppointmentsPanelProps) {
  const palette = useQueuePalette();
  const actions = { onApprove, onMore, busyId, canAct };

  return (
    <QueuePanel icon="calendar" title="Appointments" trailing={headerAction} bodyPadding={false}>
      {/* Tabs scroll sideways on a phone rather than wrapping into two rows. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
        style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        {STATUS_ORDER.map((status) => {
          const isActive = status === activeStatus;
          return (
            <Pressable
              key={status}
              onPress={() => onStatusChange(status)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${STATUS_LABELS[status]}, ${statusCounts[status] ?? 0}`}
              className="h-9 flex-row items-center gap-2 px-3.5"
              style={{
                borderRadius: QUEUE_RADIUS.pill,
                backgroundColor: isActive ? palette.primarySoft : "transparent",
              }}
            >
              <Text
                className={`text-[13.5px] ${isActive ? "font-semibold" : "font-medium"}`}
                style={{ color: isActive ? palette.primary : palette.muted }}
              >
                {STATUS_LABELS[status]}
              </Text>
              <View
                className="min-w-[22px] items-center px-1.5 py-0.5"
                style={{
                  borderRadius: QUEUE_RADIUS.pill,
                  backgroundColor: isActive ? palette.primary : palette.skeleton,
                }}
              >
                <Text
                  className="text-[11px] font-bold"
                  style={{ color: isActive ? "#FFFFFF" : palette.muted }}
                >
                  {statusCounts[status] ?? 0}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {error ? (
        <View className="items-center gap-2.5 px-6 py-12">
          <Feather name="alert-circle" size={22} color="#EF4444" />
          <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
            Unable to load appointments.
          </Text>
          <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
            {error}
          </Text>
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            className="mt-1 h-10 justify-center px-5"
            style={{ borderRadius: QUEUE_RADIUS.control, backgroundColor: palette.primary }}
          >
            <Text className="text-[13.5px] font-semibold text-white">Try Again</Text>
          </Pressable>
        </View>
      ) : loading ? (
        <View className="gap-3 px-5 py-5">
          {[0, 1, 2, 3].map((i) => (
            <View key={i} className="flex-row items-center gap-3">
              <View style={{ height: 36, width: 36, borderRadius: 999, backgroundColor: palette.skeleton }} />
              <View className="flex-1 gap-2">
                <View style={{ height: 12, width: "55%", borderRadius: 6, backgroundColor: palette.skeleton }} />
                <View style={{ height: 10, width: "35%", borderRadius: 6, backgroundColor: palette.skeleton }} />
              </View>
            </View>
          ))}
        </View>
      ) : appointments.length === 0 ? (
        <View className="items-center gap-1.5 px-6 py-14">
          <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
            No {STATUS_LABELS[activeStatus].toLowerCase()} appointments.
          </Text>
          <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
            {emptyMessage}
          </Text>
        </View>
      ) : asTable ? (
        <View className="w-full px-5 pb-2">
          <TableHeader palette={palette} canAct={canAct} />
          {appointments.map((appointment, i) => (
            <TableRow
              key={appointment._id}
              appointment={appointment}
              index={i + 1}
              serviceLabel={serviceLabels[appointment.consultationType] ?? appointment.consultationType}
              isLast={i === appointments.length - 1}
              palette={palette}
              {...actions}
            />
          ))}
        </View>
      ) : (
        <View className="w-full gap-2.5 p-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              serviceLabel={serviceLabels[appointment.consultationType] ?? appointment.consultationType}
              palette={palette}
              {...actions}
            />
          ))}
        </View>
      )}
    </QueuePanel>
  );
}
