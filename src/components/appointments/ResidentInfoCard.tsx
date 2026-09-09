import { Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";

export type ResidentInfo = {
  name: string;
  residentId: string;
  address: string;
  phone: string;
  email: string;
};

/**
 * Turns an account id into the reference shown as "Resident ID".
 *
 * Derived from the account id so it is stable and unique per resident without
 * inventing a sequence number that would read as an official barangay registry
 * entry. If MaslogCare later issues real resident numbers, this is the one
 * place that changes.
 */
export function formatResidentReference(id: string | number | null | undefined): string {
  const raw = String(id ?? "").replace(/[^a-zA-Z0-9]/g, "");
  if (!raw) return "—";
  return `RES-${raw.slice(-6).toUpperCase()}`;
}

function InfoRow({
  icon,
  value,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View className="flex-row items-center" style={{ gap: 10 }}>
      <MaterialCommunityIcons name={icon} size={17} color={APPOINTMENT_COLORS.primaryBright} />
      <Text
        accessibilityLabel={`${label}: ${value}`}
        numberOfLines={1}
        className="min-w-0 flex-1"
        style={{ fontSize: 14, color: APPOINTMENT_COLORS.bodyText }}
      >
        {value}
      </Text>
    </View>
  );
}

/**
 * The resident's own details, read from the authenticated profile.
 *
 * Read-only on purpose: these values identify the person the health team will
 * see, so the appointment form is not the place to edit them. The badge says
 * where they came from, which is why the form asks for nothing already known.
 */
export default function ResidentInfoCard({ resident }: { resident: ResidentInfo }) {
  return (
    <View
      style={{
        borderRadius: APPOINTMENT_METRICS.radiusCard,
        backgroundColor: APPOINTMENT_COLORS.surfaceTint,
        padding: 14,
        gap: 10,
      }}
    >
      <View className="flex-row flex-wrap items-center justify-between" style={{ gap: 8 }}>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <MaterialCommunityIcons
            name="account-circle"
            size={22}
            color={APPOINTMENT_COLORS.primaryBright}
          />
          <Text
            accessibilityRole="header"
            style={{ fontSize: 15.5, fontWeight: "700", color: APPOINTMENT_COLORS.primary }}
          >
            Resident Information
          </Text>
        </View>

        <View
          className="flex-row items-center"
          style={{
            gap: 5,
            borderRadius: 999,
            backgroundColor: APPOINTMENT_COLORS.successBg,
            paddingHorizontal: 9,
            paddingVertical: 5,
          }}
        >
          <Feather name="check-circle" size={12} color={APPOINTMENT_COLORS.success} />
          <Text style={{ fontSize: 11.5, fontWeight: "600", color: "#166534" }}>
            Auto-filled from your profile
          </Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <InfoRow icon="account-outline" label="Name" value={resident.name} />
        <InfoRow
          icon="card-account-details-outline"
          label="Resident ID"
          value={`Resident ID: ${resident.residentId}`}
        />
        <InfoRow icon="map-marker-outline" label="Address" value={resident.address} />
        <InfoRow icon="phone-outline" label="Contact number" value={resident.phone} />
        <InfoRow icon="email-outline" label="Email" value={resident.email} />
      </View>
    </View>
  );
}
