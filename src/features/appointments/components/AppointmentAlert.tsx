import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";

type AppointmentAlertProps = {
  message: string;
  tone: "info" | "danger";
  align?: "start" | "center";
  action?: { label: string; accessibilityLabel: string; onPress: () => void };
  children?: ReactNode;
};

const AppointmentAlert = ({
  message,
  tone,
  align = "start",
  action,
}: AppointmentAlertProps) => {
  const isDanger = tone === "danger";

  return (
    <View
      className={align === "center" ? "flex-row items-center" : "flex-row items-start"}
      style={{
        gap: 10,
        borderRadius: APPOINTMENT_METRICS.radiusField,
        padding: 12,
        ...(isDanger
          ? {
              borderWidth: 1,
              borderColor: APPOINTMENT_COLORS.dangerBorder,
              backgroundColor: APPOINTMENT_COLORS.dangerBg,
            }
          : { backgroundColor: APPOINTMENT_COLORS.surfaceTint }),
      }}
    >
      <Feather
        name={isDanger ? "alert-triangle" : "info"}
        size={isDanger ? 16 : 17}
        color={isDanger ? APPOINTMENT_COLORS.danger : APPOINTMENT_COLORS.primaryBright}
      />

      <Text
        accessibilityRole={isDanger ? "alert" : undefined}
        className="min-w-0 flex-1"
        style={{
          fontSize: 13,
          lineHeight: isDanger ? 18 : 19,
          color: isDanger ? "#991B1B" : APPOINTMENT_COLORS.bodyText,
        }}
      >
        {message}
      </Text>

      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel}
          onPress={action.onPress}
          className="items-center justify-center rounded-lg px-3"
          style={{
            height: 34,
            backgroundColor: APPOINTMENT_COLORS.white,
            borderWidth: 1,
            borderColor: APPOINTMENT_COLORS.dangerBorder,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "700", color: APPOINTMENT_COLORS.danger }}>
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default AppointmentAlert;
