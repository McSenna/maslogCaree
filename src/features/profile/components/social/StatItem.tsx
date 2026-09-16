import { Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { formatCount } from "../../utils/profileHelpers";

type StatItemProps = {
  label: string;
  value: number;
  loading?: boolean;
  compact?: boolean;
};

const StatItem = ({ label, value, loading = false, compact = false }: StatItemProps) => (
  <View
    accessible
    accessibilityLabel={loading ? `${label}, loading` : `${label}: ${value}`}
    style={{ flex: 1, alignItems: "center", gap: 3, paddingVertical: 4 }}
  >
    {loading ? (
      <View
        style={{
          width: 34,
          height: 22,
          borderRadius: 6,
          backgroundColor: SOCIAL_COLORS.divider,
        }}
      />
    ) : (
      <Text
        maxFontSizeMultiplier={1.2}
        style={{
          fontSize: compact ? 19 : 21,
          fontWeight: "800",
          letterSpacing: -0.4,
          color: SOCIAL_COLORS.statValue,
        }}
      >
        {formatCount(value)}
      </Text>
    )}

    <Text
      numberOfLines={1}
      maxFontSizeMultiplier={1.2}
      style={{
        fontSize: compact ? 11.5 : 12.5,
        fontWeight: "600",
        color: SOCIAL_COLORS.muted,
      }}
    >
      {label}
    </Text>
  </View>
);

export default StatItem;
