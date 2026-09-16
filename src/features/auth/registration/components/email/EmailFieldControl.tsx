import { useState } from "react";
import { Platform, TextInput, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";

import { REG_COLORS } from "../../registrationTheme";
import { fieldSurface } from "../fieldStyles";
import EmailActionSlot from "./EmailActionSlot";
import type { EmailActionState } from "./emailActionState";

type EmailFieldControlProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  action: EmailActionState;
  onActionPress: () => void;
  invalid: boolean;
  editable: boolean;
  height: number;
  labelledBy: string;
};

const NARROW_WIDTH = 400;

const EmailFieldControl = ({
  value,
  onChangeText,
  onBlur,
  action,
  onActionPress,
  invalid,
  editable,
  height,
  labelledBy,
}: EmailFieldControlProps) => {
  const { width } = useWindowDimensions();
  const [focused, setFocused] = useState(false);

  const narrow = width < NARROW_WIDTH;
  const horizontalPadding = narrow ? 11 : 14;
  const iconGap = narrow ? 8 : 10;

  const handleBlur = () => {
    setFocused(false);
    onBlur();
  };

  return (
    <View
      {...INPUT_SHELL_PROPS}
      style={{
        flexDirection: "row",
        alignItems: "center",
        height,
        overflow: "hidden",
        ...fieldSurface({ focused, invalid }),
        ...Platform.select({
          web: {
            transition: "border-color 180ms ease, box-shadow 180ms ease",
          } as object,
        }),
      }}
    >
      <View
        style={{
          flex: 1,
          minWidth: 0,
          flexDirection: "row",
          alignItems: "center",
          gap: iconGap,
          paddingLeft: horizontalPadding,
          paddingRight: narrow ? 6 : 8,
        }}
      >
        <Feather
          name="mail"
          size={19}
          color={invalid ? REG_COLORS.error : focused ? REG_COLORS.primary : REG_COLORS.subtle}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          editable={editable}
          placeholder="you@example.com"
          placeholderTextColor={REG_COLORS.subtle}
          keyboardType="email-address"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          accessibilityLabel="Email Address"
          accessibilityLabelledBy={labelledBy}
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: narrow ? 14.5 : 15,
            color: editable ? REG_COLORS.text : REG_COLORS.muted,
            paddingVertical: 0,
            borderWidth: 0,
            backgroundColor: "transparent",
            ...Platform.select({
              web: { outlineStyle: "none", boxShadow: "none" } as object,
            }),
          }}
        />
      </View>

      <View style={{ width: 1, alignSelf: "stretch", backgroundColor: REG_COLORS.border }} />

      <EmailActionSlot
        action={action}
        onPress={onActionPress}
        height={height}
        minWidth={narrow ? 104 : 118}
        fontSize={narrow ? 10.5 : 11.5}
      />
    </View>
  );
};

export default EmailFieldControl;
