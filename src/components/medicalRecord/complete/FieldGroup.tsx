import { useMemo } from "react";
import { Text, View } from "react-native";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalField } from "@/services/medicalRecords";

const GUTTER = 12;

type Block = { kind: "grid" | "single"; fields: MedicalField[] };

const toBlocks = (fields: MedicalField[]): Block[] => {
  const blocks: Block[] = [];
  for (const field of fields) {
    const kind: Block["kind"] = field.type === "number" ? "grid" : "single";
    const last = blocks[blocks.length - 1];
    if (kind === "grid" && last?.kind === "grid") last.fields.push(field);
    else blocks.push({ kind, fields: [field] });
  }
  return blocks;
};

const FieldGroup = ({
  title,
  fields,
  twoColumn,
  renderField,
}: {
  title?: string;
  fields: MedicalField[];
  twoColumn: boolean;
  renderField: (field: MedicalField) => React.ReactNode;
}) => {
  const palette = useQueuePalette();
  const blocks = useMemo(() => toBlocks(fields), [fields]);

  if (!fields.length) return null;

  return (
    <View className="w-full gap-3.5">
      {title ? (
        <Text
          className="text-[11.5px] font-bold uppercase"
          style={{ color: palette.subtle, letterSpacing: 0.5 }}
        >
          {title}
        </Text>
      ) : null}

      {blocks.map((block, index) =>
        block.kind === "single" ? (
          <View key={block.fields[0].key}>{renderField(block.fields[0])}</View>
        ) : (
          <View
            key={`grid-${index}-${block.fields[0].key}`}
            className="w-full flex-row flex-wrap"
            style={{ gap: GUTTER }}
          >
            {block.fields.map((field) => (
              <View
                key={field.key}
                style={{
                  flexGrow: 1,
                  flexBasis: twoColumn ? "46%" : "100%",
                }}
              >
                {renderField(field)}
              </View>
            ))}
          </View>
        )
      )}
    </View>
  );
};

export default FieldGroup;
