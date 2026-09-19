import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Text, View } from "react-native";

import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import HelpSectionHeading from "./HelpSectionHeading";
import type { SupportContactInfo } from "../types/support.types";

type ContactInformationProps = {
  contact: SupportContactInfo | null;
  loading: boolean;
};

const ContactRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
      <Feather name={icon} size={15} color={palette.primary} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: palette.subtle }}>
          {label.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 13.5, lineHeight: 19, color: palette.body }}>{value}</Text>
      </View>
    </View>
  );
};

const ContactInformation = ({ contact, loading }: ContactInformationProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View>
      <HelpSectionHeading
        title={contact?.name ?? "Barangay Maslog Health Center"}
        description="For concerns that require direct assistance, you may contact or visit the Barangay Health Center during official operating hours."
      />

      <View
        style={{
          gap: 14,
          padding: 16,
          borderRadius: RADIUS.card,
          backgroundColor: palette.cardBg,
          borderWidth: 1,
          borderColor: palette.cardBorder,
          ...CARD_SHADOW,
        }}
      >
        {loading || !contact ? (
          <ActivityIndicator color={palette.primary} />
        ) : (
          <>
            <ContactRow icon="map-pin" label="Location" value={contact.location} />
            <ContactRow icon="phone" label="Contact number" value={contact.contactNumber} />
            <ContactRow icon="mail" label="Email" value={contact.email} />
            <ContactRow
              icon="clock"
              label="Office hours"
              value={contact.officeHours
                .map((entry) => `${entry.days}: ${entry.hours}`)
                .join("\n")}
            />
            <ContactRow icon="message-circle" label="Support response" value={contact.responseTime} />
          </>
        )}
      </View>
    </View>
  );
};

export default ContactInformation;
