import { Text, View } from "react-native";

import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";

import { describeFieldValue, hasValue } from "../complete/describeValue";
import { Block, Row, formatWhen } from "./RecordPrimitives";

type SectionProps = {
  record: MedicalRecord;
  form: CompletionForm | null;
  palette: QueuePalette;
};

export const CompletedBadge = ({ record, palette }: Omit<SectionProps, "form">) => (
  <View
    className="w-full flex-row items-center gap-2 self-start px-3 py-1.5"
    style={{ borderRadius: QUEUE_RADIUS.pill, backgroundColor: palette.statuses.completed.bg }}
  >
    <View
      className="h-2 w-2 rounded-full"
      style={{ backgroundColor: palette.statuses.completed.dot }}
    />
    <Text
      className="text-[12.5px] font-semibold"
      style={{ color: palette.statuses.completed.fg }}
    >
      Completed {formatWhen(record.completedAt)}
    </Text>
  </View>
);

export const VisitBlock = ({ record, form, palette }: SectionProps) => {
  const providerName =
    typeof record.provider === "object" && record.provider ? record.provider.fullname : undefined;
  const residentName =
    typeof record.resident === "object" && record.resident ? record.resident.fullname : undefined;
  const appointment = typeof record.appointment === "object" ? record.appointment : null;

  return (
    <Block title="Visit" palette={palette}>
      <Row label="Patient" value={residentName || "—"} palette={palette} />
      <Row label="Service" value={form?.label ?? record.serviceType} palette={palette} />
      <Row label="Provider" value={providerName || "—"} palette={palette} />
      <Row
        label="Appointment"
        value={formatWhen(record.appointmentDate ?? appointment?.slotStart)}
        palette={palette}
      />
      <Row label="Completed" value={formatWhen(record.completedAt)} palette={palette} />
    </Block>
  );
};

export const ClinicalBlock = ({ record, palette }: Omit<SectionProps, "form">) => (
  <Block title="Clinical" palette={palette}>
    {[
      { label: "Assessment", value: record.assessment || "—" },
      { label: "Findings", value: record.findings || "—" },
      { label: "Diagnosis", value: record.diagnosis || "—" },
      { label: "Recommendations", value: record.recommendations || "—" },
    ].map((row) => (
      <Row key={row.label} label={row.label} value={row.value} palette={palette} />
    ))}
  </Block>
);

export const ServiceDetailsBlock = ({ record, form, palette }: SectionProps) => {
  const serviceFields = form?.service ?? [];
  const details = record.serviceDetails ?? {};
  const detailKeys = Array.from(
    new Set([...serviceFields.map((f) => f.key), ...Object.keys(details)])
  ).filter((key) => hasValue(details[key]));

  if (!detailKeys.length) return null;

  return (
    <Block
      title={form?.label ? `${form.label} details` : "Service details"}
      palette={palette}
    >
      {detailKeys.map((key) => {
        const field = serviceFields.find((f) => f.key === key);
        return (
          <Row
            key={key}
            label={field?.label ?? key}
            value={describeFieldValue(field, details[key])}
            palette={palette}
          />
        );
      })}
    </Block>
  );
};

export const ItemsGivenBlock = ({ record, palette }: Omit<SectionProps, "form">) => {
  const itemsGiven = record.itemsGiven ?? [];
  if (!itemsGiven.length) return null;

  return (
    <Block title="Medicines / Supplies Given" palette={palette}>
      {itemsGiven.map((given, index) => (
        <Row
          key={`${given.item}-${index}`}
          label={given.itemName}
          value={[
            `${given.quantity} ${given.unit}`,
            given.batchNumbers?.length ? `Batch ${given.batchNumbers.join(", ")}` : "",
          ]
            .filter(Boolean)
            .join(" · ")}
          palette={palette}
        />
      ))}
    </Block>
  );
};

export const FollowUpBlock = ({ record, palette }: Omit<SectionProps, "form">) => (
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
);
