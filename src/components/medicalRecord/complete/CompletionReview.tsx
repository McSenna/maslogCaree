import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { QUEUE_RADIUS, useQueuePalette, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { CompletionForm, MedicalField } from "@/services/medicalRecords";
import type { FormValues } from "../MedicalRecordForm";
import type { DispensedLine } from "../dispensing/useDispensedItems";
import { describeFieldValue, hasValue } from "./describeValue";

const Row = ({ label, value, palette }: { label: string; value: string; palette: QueuePalette }) => {
  return (
    <View className="w-full flex-row items-start gap-3 py-1.5">
      <Text className="text-[12px] font-medium" style={{ color: palette.muted, width: 124 }}>
        {label}
      </Text>
      <Text className="min-w-0 flex-1 text-[12.5px] leading-[18px]" style={{ color: palette.heading }}>
        {value}
      </Text>
    </View>
  );
};

const Block = ({
  title,
  rows,
  palette,
}: {
  title: string;
  rows: { label: string; value: string }[];
  palette: QueuePalette;
}) => {
  if (!rows.length) return null;
  return (
    <View className="w-full gap-0.5">
      <Text
        className="mb-1 text-[11px] font-bold uppercase"
        style={{ color: palette.subtle, letterSpacing: 0.5 }}
      >
        {title}
      </Text>
      {rows.map((row) => (
        <Row key={row.label} label={row.label} value={row.value} palette={palette} />
      ))}
    </View>
  );
};

const toBlocks = (fields: MedicalField[], values: FormValues, fallbackTitle: string) => {
  const blocks = new Map<string, { label: string; value: string }[]>();

  for (const field of fields) {
    const value = values[field.key];
    if (!hasValue(value)) continue;
    const title = field.group ?? fallbackTitle;
    const rows = blocks.get(title) ?? [];
    rows.push({ label: field.label, value: describeFieldValue(field, value) });
    blocks.set(title, rows);
  }

  return Array.from(blocks, ([title, rows]) => ({ title, rows }));
};

const CompletionReview = ({
  form,
  values,
  lines,
  serviceLabel,
}: {
  form: CompletionForm;
  values: FormValues;
  lines: DispensedLine[];
  serviceLabel: string;
}) => {
  const palette = useQueuePalette();

  const serviceBlocks = toBlocks(form.service, values, serviceLabel);
  const clinicalBlocks = toBlocks(form.common, values, "Clinical assessment");
  const followUpRows = values.followUpRequired
    ? [
        { label: "Follow-up", value: "Required" },
        ...(hasValue(values.followUpDate)
          ? [
              {
                label: "Follow-up date",
                value: describeFieldValue(
                  form.followUp.find((f) => f.key === "followUpDate"),
                  values.followUpDate
                ),
              },
            ]
          : []),
      ]
    : [];

  return (
    <View className="w-full gap-4">
      {serviceBlocks.map((block) => (
        <Block key={block.title} title={block.title} rows={block.rows} palette={palette} />
      ))}
      {clinicalBlocks.map((block) => (
        <Block key={block.title} title={block.title} rows={block.rows} palette={palette} />
      ))}
      <Block title="Follow-up" rows={followUpRows} palette={palette} />

      {lines.length ? (
        <View
          className="w-full gap-2 p-3"
          style={{
            borderRadius: QUEUE_RADIUS.control,
            borderWidth: 1,
            borderColor: palette.panelBorder,
            backgroundColor: palette.rowHover,
          }}
        >
          <Text className="text-[11px] font-bold uppercase" style={{ color: palette.subtle, letterSpacing: 0.5 }}>
            Will be deducted from inventory
          </Text>
          {lines.map((line) => (
            <View key={line.item._id} className="flex-row items-center gap-3">
              <Text numberOfLines={1} className="min-w-0 flex-1 text-[12.5px]" style={{ color: palette.body }}>
                {line.item.name}
              </Text>
              <Text className="text-[12.5px] font-semibold" style={{ color: palette.heading }}>
                {line.quantity} {line.item.unit}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className="w-full flex-row items-start gap-2.5">
        <Feather name="info" size={14} color={palette.muted} style={{ marginTop: 1 }} />
        <Text className="min-w-0 flex-1 text-[12px] leading-[17px]" style={{ color: palette.muted }}>
          Completing files this record against the patient&apos;s history, marks the appointment as completed and
          removes the patient from the active queue.
        </Text>
      </View>
    </View>
  );
};

export default CompletionReview;
