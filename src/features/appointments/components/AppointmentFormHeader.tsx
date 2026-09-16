import { Pressable, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { APPOINTMENT_COLORS } from "./appointmentTheme";

type AppointmentFormHeaderProps = {
  onClose: () => void;
  disabled: boolean;
};

const AppointmentFormHeader = ({
  onClose,
  disabled,
}: AppointmentFormHeaderProps) => {
  return (
    <View className="flex-row items-center" style={{ gap: 12 }}>
      <View
        className="items-center justify-center"
        style={{
          width: 46,
          height: 46,
          borderRadius: 13,
          backgroundColor: APPOINTMENT_COLORS.surfaceTintStrong,
        }}
      >
        <MaterialCommunityIcons
          name="calendar-month"
          size={24}
          color={APPOINTMENT_COLORS.primaryBright}
        />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          accessibilityRole="header"
          style={{ fontSize: 21, fontWeight: "800", color: APPOINTMENT_COLORS.primary }}
        >
          Book an Appointment
        </Text>
        <Text style={{ fontSize: 13.5, color: APPOINTMENT_COLORS.mutedText }}>
          Resident Appointment Form
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close appointment form"
        hitSlop={12}
        onPress={onClose}
        disabled={disabled}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: APPOINTMENT_COLORS.surfaceTint }}
      >
        <Feather name="x" size={17} color={APPOINTMENT_COLORS.mutedText} />
      </Pressable>
    </View>
  );
};

export default AppointmentFormHeader;
