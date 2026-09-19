import type { RefObject } from "react";
import { Text, TextInput, View } from "react-native";

import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";
import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import SupportFieldShell from "./SupportFieldShell";
import { SUPPORT_LIMITS, SUPPORT_PLACEHOLDERS } from "../constants/support.constants";

type SupportDescriptionInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  inputRef?: RefObject<TextInput | null>;
};

const DESCRIPTION_MIN_HEIGHT = 120;
const DESCRIPTION_MAX_HEIGHT = 160;

const SupportDescriptionInput = ({
  value,
  onChangeText,
  error,
  inputRef,
}: SupportDescriptionInputProps) => {
  const palette = useResidentDialogPalette();
  const remaining = SUPPORT_LIMITS.descriptionMax - value.length;

  return (
    <SupportFieldShell label="Description" required error={error}>
      <View
        {...INPUT_SHELL_PROPS}
        style={{
          borderRadius: RADIUS.control,
          backgroundColor: palette.cardRaised,
          borderWidth: 1,
          borderColor: error ? palette.danger : palette.border,
        }}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={SUPPORT_PLACEHOLDERS.description}
          placeholderTextColor={palette.muted}
          accessibilityLabel="Description of your concern"
          multiline
          textAlignVertical="top"
          maxLength={SUPPORT_LIMITS.descriptionMax}
          style={
            {
              minHeight: DESCRIPTION_MIN_HEIGHT,
              maxHeight: DESCRIPTION_MAX_HEIGHT,
              padding: 12,
              fontSize: 14,
              lineHeight: 20,
              color: palette.body,
              outlineStyle: "none",
            } as never
          }
        />
      </View>

      <Text
        style={{
          alignSelf: "flex-end",
          fontSize: 11.5,
          color: remaining < 100 ? palette.warningFg : palette.muted,
        }}
      >
        {value.length} / {SUPPORT_LIMITS.descriptionMax}
      </Text>
    </SupportFieldShell>
  );
};

export default SupportDescriptionInput;
