import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

const EmergencyNotice = () => {
  const palette = useResidentDialogPalette();

  return (
    <View
      accessibilityRole="alert"
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        padding: 16,
        borderRadius: RADIUS.card,
        backgroundColor: palette.warningSoft,
        borderWidth: 1,
        borderColor: palette.warning,
      }}
    >
      <Feather name="alert-triangle" size={18} color={palette.warning} style={{ marginTop: 1 }} />

      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: 14.5, fontWeight: "700", color: palette.warningFg }}
        >
          Medical Emergency
        </Text>
        <Text style={{ fontSize: 13, lineHeight: 19, color: palette.body }}>
          MaslogCare Contact Support is intended for system-related concerns and non-emergency
          assistance. Do not use the support form for medical emergencies requiring immediate
          attention. Contact the appropriate emergency service or proceed to the nearest healthcare
          facility.
        </Text>
      </View>
    </View>
  );
};

export default EmergencyNotice;
