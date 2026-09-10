import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { FIELD_COLORS } from "../constants/registrationFields";
import { formatBirthDate } from "../utils/dateOfBirth";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";

type DateOfBirthFieldProps = {
  value: string;
  onPress: () => void;
  error?: string;
};

/**
 * Opens the date wheel rather than accepting typing.
 *
 * A birthday typed free-hand arrives in a dozen formats; the wheel can only
 * produce the one the API stores.
 */
export default function DateOfBirthField({ value, onPress, error }: DateOfBirthFieldProps) {
  const hasValue = Boolean(value);

  return (
    <View>
      <FieldLabel>Date of Birth *</FieldLabel>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Select your date of birth"
        className="flex-row items-center rounded-xl border px-3"
        style={{
          borderColor: error
            ? FIELD_COLORS.borderError
            : hasValue
              ? FIELD_COLORS.borderFocused
              : FIELD_COLORS.border,
          backgroundColor: hasValue ? FIELD_COLORS.backgroundFocused : FIELD_COLORS.background,
          height: 46,
        }}
      >
        <Feather
          name="calendar"
          size={14}
          color={hasValue ? FIELD_COLORS.iconFocused : FIELD_COLORS.icon}
        />
        <Text
          className="flex-1 pl-2.5 text-sm"
          style={{ color: hasValue ? FIELD_COLORS.text : FIELD_COLORS.placeholder }}
        >
          {hasValue ? formatBirthDate(value) : "Select your date of birth"}
        </Text>
        <Feather
          name="chevron-down"
          size={14}
          color={hasValue ? FIELD_COLORS.iconFocused : FIELD_COLORS.icon}
        />
      </Pressable>
      <FieldError message={error} />
    </View>
  );
}
