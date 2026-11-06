import { Text, View } from "react-native";

import { TYPE } from "@/theme/typography";

import { FIELD_LABEL_WIDTH, type ResidentFieldListProps } from "./residentFieldList.types";

/** Native label/value rows; each row reads as one "label, value" item for TalkBack. */
const ResidentFieldList = ({ fields, colors }: ResidentFieldListProps) => (
  <View>
    {fields.map((field, index) => (
      <View
        key={field.key}
        accessible
        accessibilityLabel={`${field.label}, ${field.value}`}
        className="flex-row items-start gap-3 py-3"
        style={index === 0 ? undefined : { borderTopWidth: 1, borderTopColor: colors.divider }}
      >
        <Text style={[TYPE.caption, { width: FIELD_LABEL_WIDTH, color: colors.muted }]}>{field.label}</Text>
        <Text
          style={[
            TYPE.body,
            { flex: 1, minWidth: 0, color: field.recorded ? colors.heading : colors.muted },
            field.recorded ? null : { fontStyle: "italic" },
          ]}
        >
          {field.value}
        </Text>
      </View>
    ))}
  </View>
);

export default ResidentFieldList;
