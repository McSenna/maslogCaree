import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { FIELD_COLORS } from "../constants/registrationFields";

type FieldErrorProps = {
  /** Empty or undefined renders nothing, so callers need no guard of their own. */
  message?: string;
  /** The photo field sits its message a little lower than the inputs do. */
  className?: string;
};

/** What is wrong with one field, under the field it belongs to. */
export default function FieldError({ message, className = "mt-1" }: FieldErrorProps) {
  if (!message) return null;

  return (
    <View className={`flex-row items-center gap-1 ${className}`}>
      <Feather name="alert-circle" size={11} color={FIELD_COLORS.borderError} />
      <Text className="text-[10px] text-red-500">{message}</Text>
    </View>
  );
}
