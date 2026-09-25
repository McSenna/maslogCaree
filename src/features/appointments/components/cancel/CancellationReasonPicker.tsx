import { Text, TextInput, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

import { RadioOption } from "./RadioOption";

export const CANCELLATION_REASONS = [
  "Schedule conflict",
  "Feeling better",
  "Booked another appointment",
  "Personal reason",
  "Other",
] as const;

export const OTHER_REASON = "Other";

type Props = {
  palette: ResidentDialogPalette;
  selected: string;
  customReason: string;
  disabled: boolean;
  onSelect: (reason: string) => void;
  onCustomReasonChange: (value: string) => void;
};

export const CancellationReasonPicker = ({
  palette,
  selected,
  customReason,
  disabled,
  onSelect,
  onCustomReasonChange,
}: Props) => (
  <View>
    <Text style={{ fontSize: 13, fontWeight: "600", color: palette.heading, marginBottom: 8 }}>
      Reason for Cancellation (Optional)
    </Text>

    <View style={{ gap: 8 }} accessibilityRole="radiogroup">
      {CANCELLATION_REASONS.map((reason) => (
        <RadioOption
          key={reason}
          palette={palette}
          label={reason}
          selected={selected === reason}
          disabled={disabled}
          onPress={() => onSelect(reason)}
        />
      ))}
    </View>

    {selected === OTHER_REASON ? (
      <TextInput
        placeholder="Please specify your reason (optional)…"
        placeholderTextColor={palette.muted}
        value={customReason}
        onChangeText={onCustomReasonChange}
        editable={!disabled}
        maxLength={200}
        multiline
        accessibilityLabel="Other cancellation reason"
        style={{
          marginTop: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.cardRaised,
          padding: 12,
          color: palette.heading,
          fontSize: 13.5,
          minHeight: 70,
          textAlignVertical: "top",
        }}
      />
    ) : null}
  </View>
);

export default CancellationReasonPicker;
