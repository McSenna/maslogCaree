import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { PROVIDER_ROLE_LABELS, type ServiceTypeOption } from "@/config/appointmentServices";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";

type ServiceCatalogItemProps = {
  service: ServiceTypeOption;
};

// Information only: booking starts from the one "Book appointment" action, where the service is chosen.
const ServiceCatalogItem = ({ service }: ServiceCatalogItemProps) => {
  const colors = useThemeColors();
  const { resolvedTheme } = useTheme();
  const visual = resolveVisual(getServiceVisual(service.id), resolvedTheme === "dark");
  const provider = service.queueRole ? PROVIDER_ROLE_LABELS[service.queueRole] : null;

  return (
    <View
      accessible
      accessibilityLabel={[service.label, service.description, provider ? `Seen by: ${provider}` : null]
        .filter(Boolean)
        .join(". ")}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: SPACING.md,
        padding: SPACING.lg,
        borderRadius: RADII.medium,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: RADII.small,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: visual.tint,
        }}
      >
        <MaterialCommunityIcons name={visual.icon} size={22} color={visual.fg} />
      </View>

      <View style={{ flex: 1, minWidth: 0, gap: SPACING.xs }}>
        <Text style={{ fontSize: 16, lineHeight: 22, fontWeight: "700", color: colors.heading }}>
          {service.label}
        </Text>
        {service.description ? (
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.body }}>{service.description}</Text>
        ) : null}
        {provider ? (
          <Text style={{ fontSize: 13, lineHeight: 18, color: colors.muted }}>Seen by: {provider}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default ServiceCatalogItem;
