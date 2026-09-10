import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { CompletionForm, MedicalField, MedicalRecord } from "@/services/medicalRecords";
import { QUEUE_RADIUS, useQueuePalette, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { formatDateTime } from "@/utils/dateFormatter";

const SHEET_WIDTH = 768;

function formatWhen(iso?: string | null): string {
  if (!iso) return "—";
  const { date, time } = formatDateTime(iso);
  return `${date} · ${time}`;
}

/**
 * Renders one stored value using the field that collected it.
 *
 * The form comes back with the record, so a select shows the label a health
 * worker picked rather than the key that was stored, and a value written
 * before a field was renamed still reads correctly.
 */
function describeValue(field: MedicalField | undefined, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (field?.type === "select") {
    return field.options?.find((o) => o.value === value)?.label ?? String(value);
  }
  if (field?.type === "boolean") return value ? "Yes" : "No";
  if (field?.type === "date") {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }
  return String(value);
}

function Row({ label, value, palette }: { label: string; value: string; palette: QueuePalette }) {
  return (
    <View className="w-full flex-row items-start gap-3 py-2">
      <Text className="text-[12.5px] font-medium" style={{ color: palette.muted, width: 132 }}>
        {label}
      </Text>
      <Text className="min-w-0 flex-1 text-[13px] leading-[19px]" style={{ color: palette.heading }}>
        {value}
      </Text>
    </View>
  );
}

function Block({ title, children, palette }: { title: string; children: React.ReactNode; palette: QueuePalette }) {
  return (
    <View className="w-full">
      <Text className="mb-1 text-[12px] font-bold uppercase" style={{ color: palette.subtle, letterSpacing: 0.5 }}>
        {title}
      </Text>
      <View
        className="w-full px-3.5 py-1"
        style={{ borderRadius: QUEUE_RADIUS.control, borderWidth: 1, borderColor: palette.panelBorder }}
      >
        {children}
      </View>
    </View>
  );
}

/**
 * A completed visit's record, read-only.
 *
 * Read-only by default and with no edit affordance at all: amending a clinical
 * record is a different act from writing one, with its own audit requirements,
 * and a pencil icon that opens nothing is worse than no pencil.
 *
 * `showProviderNotes` is off for a resident. The server already withholds the
 * notes column from their endpoint, so this is the second of two locks rather
 * than the only one.
 */
export default function MedicalRecordDetails({
  visible,
  record,
  form,
  onClose,
  showProviderNotes = true,
}: {
  visible: boolean;
  record: MedicalRecord | null;
  /** The form that produced the record. Null while it loads. */
  form: CompletionForm | null;
  onClose: () => void;
  showProviderNotes?: boolean;
}) {
  const palette = useQueuePalette();
  const { width } = useWindowDimensions();
  const isSheet = width < SHEET_WIDTH;

  if (!record) return null;

  const providerName =
    typeof record.provider === "object" && record.provider ? record.provider.fullname : undefined;
  const residentName =
    typeof record.resident === "object" && record.resident ? record.resident.fullname : undefined;
  const appointment = typeof record.appointment === "object" ? record.appointment : null;

  const serviceFields = form?.service ?? [];
  const details = record.serviceDetails ?? {};
  // Keys the form no longer declares still render, labelled by their key: a
  // record must not quietly lose a value because the catalogue moved on.
  const detailKeys = Array.from(new Set([...serviceFields.map((f) => f.key), ...Object.keys(details)]));

  const clinical: { label: string; value: string }[] = [
    { label: "Assessment", value: record.assessment || "—" },
    { label: "Findings", value: record.findings || "—" },
    { label: "Diagnosis", value: record.diagnosis || "—" },
    { label: "Recommendations", value: record.recommendations || "—" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className={`flex-1 ${isSheet ? "justify-end" : "items-center justify-center p-4"}`}
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close medical record"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isSheet ? undefined : 620,
            maxHeight: isSheet ? "92%" : "88%",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isSheet ? 0 : 24,
            borderBottomRightRadius: isSheet ? 0 : 24,
            backgroundColor: palette.panelBg,
          }}
        >
          {isSheet ? (
            <View className="items-center pb-1 pt-2.5">
              <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }} />
            </View>
          ) : null}

          <View
            className="flex-row items-center justify-between gap-3 px-5 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
          >
            <View className="min-w-0 flex-1">
              <Text accessibilityRole="header" className="text-[17px] font-bold" style={{ color: palette.heading }}>
                Medical Record
              </Text>
              <Text numberOfLines={1} className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
                {form?.label ?? record.serviceType}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close medical record"
              hitSlop={12}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.skeleton }}
            >
              <Feather name="x" size={17} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
            <View
              className="w-full flex-row items-center gap-2 self-start px-3 py-1.5"
              style={{ borderRadius: QUEUE_RADIUS.pill, backgroundColor: palette.statuses.completed.bg }}
            >
              <View className="h-2 w-2 rounded-full" style={{ backgroundColor: palette.statuses.completed.dot }} />
              <Text className="text-[12.5px] font-semibold" style={{ color: palette.statuses.completed.fg }}>
                Completed {formatWhen(record.completedAt)}
              </Text>
            </View>

            <Block title="Visit" palette={palette}>
              <Row label="Patient" value={residentName || "—"} palette={palette} />
              <Row label="Service" value={form?.label ?? record.serviceType} palette={palette} />
              <Row label="Provider" value={providerName || "—"} palette={palette} />
              <Row label="Appointment" value={formatWhen(record.appointmentDate ?? appointment?.slotStart)} palette={palette} />
              <Row label="Completed" value={formatWhen(record.completedAt)} palette={palette} />
            </Block>

            <Block title="Clinical" palette={palette}>
              {clinical.map((row) => (
                <Row key={row.label} label={row.label} value={row.value} palette={palette} />
              ))}
            </Block>

            {detailKeys.length ? (
              <Block title={form?.label ? `${form.label} details` : "Service details"} palette={palette}>
                {detailKeys.map((key) => {
                  const field = serviceFields.find((f) => f.key === key);
                  return (
                    <Row
                      key={key}
                      label={field?.label ?? key}
                      value={describeValue(field, details[key])}
                      palette={palette}
                    />
                  );
                })}
              </Block>
            ) : null}

            <Block title="Follow-up" palette={palette}>
              <Row label="Required" value={record.followUpRequired ? "Yes" : "No"} palette={palette} />
              {record.followUpRequired ? (
                <Row
                  label="Date"
                  value={
                    record.followUpDate
                      ? new Date(record.followUpDate).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "To be arranged"
                  }
                  palette={palette}
                />
              ) : null}
            </Block>

            {showProviderNotes && record.notes ? (
              <Block title="Provider notes" palette={palette}>
                <Row label="Notes" value={record.notes} palette={palette} />
              </Block>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
