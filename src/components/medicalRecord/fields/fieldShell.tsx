import { Text, View } from "react-native";

import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalField } from "@/services/medicalRecords";

export type FieldValue = string | number | boolean | null | undefined;

export type FieldPartProps = {
  field: MedicalField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  palette: QueuePalette;
  helper?: string;
  error?: string;
  disabled?: boolean;
};

export const toDateKey = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const parseDateKey = (value: FieldValue): Date => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [y, m, d] = value.slice(0, 10).split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }
  return new Date();
};

export const buildShellStyle = (
  palette: QueuePalette,
  error?: string,
  disabled?: boolean
) =>
  ({
    borderRadius: QUEUE_RADIUS.control,
    borderWidth: 1,
    borderColor: error ? "#DC2626" : palette.panelBorder,
    backgroundColor: palette.isDark ? "#0B1220" : "#FFFFFF",
    opacity: disabled ? 0.6 : 1,
  }) as const;

export const FieldLabel = ({
  field,
  palette,
}: {
  field: MedicalField;
  palette: QueuePalette;
}) => (
  <View className="mb-1.5 flex-row items-center gap-1">
    <Text className="text-[13px] font-semibold" style={{ color: palette.body }}>
      {field.label}
    </Text>
    {field.required ? (
      <Text className="text-[13px] font-semibold" style={{ color: "#DC2626" }}>
        *
      </Text>
    ) : null}
  </View>
);

export const FieldHelper = ({
  helper,
  error,
  palette,
}: {
  helper?: string;
  error?: string;
  palette: QueuePalette;
}) => {
  if (!helper) return null;
  return (
    <Text className="mt-1 text-[11.5px]" style={{ color: error ? "#DC2626" : palette.subtle }}>
      {helper}
    </Text>
  );
};
