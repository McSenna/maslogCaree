import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { TYPE } from "@/theme/typography";

import { APPOINTMENT_COLORS } from "./appointmentTheme";

/** The red line under a booking field; announced as an alert when it appears. */
const FieldErrorText = ({ message }: { message?: string | null }) =>
  message ? (
    <View className="mt-1.5 flex-row items-center gap-1.5">
      <Feather name="alert-circle" size={13} color={APPOINTMENT_COLORS.danger} />
      <Text accessibilityRole="alert" className="flex-1" style={[TYPE.caption, { color: APPOINTMENT_COLORS.danger }]}>
        {message}
      </Text>
    </View>
  ) : null;

export default FieldErrorText;
