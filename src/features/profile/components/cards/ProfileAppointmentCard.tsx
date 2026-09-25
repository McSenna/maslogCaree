import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS } from "../../config/profileTheme";
import {
  appointmentDetailLines,
  appointmentTitle,
} from "../../utils/appointmentPresentation";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";

type ProfileAppointmentCardProps = {
  appointment: AppointmentRecord;
};

const ProfileAppointmentCard = ({ appointment }: ProfileAppointmentCardProps) => {
  const title = appointmentTitle(appointment);
  const lines = appointmentDetailLines(appointment);

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${lines.map((line) => line.value).join(". ")}`}
      style={{
        gap: 10,
        padding: 14,
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: SOCIAL_COLORS.surface,
        borderWidth: 1,
        borderColor: SOCIAL_COLORS.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <Text
          numberOfLines={2}
          maxFontSizeMultiplier={1.2}
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            fontWeight: "700",
            color: SOCIAL_COLORS.navy,
          }}
        >
          {title}
        </Text>

        <AppointmentStatusBadge status={appointment.status} audience="resident" />
      </View>

      <View style={{ gap: 6 }}>
        {lines.map((line) => (
          <View key={line.key} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name={line.icon} size={14} color={SOCIAL_COLORS.subtle} />
            <Text
              numberOfLines={2}
              maxFontSizeMultiplier={1.2}
              style={{ flex: 1, minWidth: 0, fontSize: 13, color: SOCIAL_COLORS.body }}
            >
              {line.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfileAppointmentCard;
