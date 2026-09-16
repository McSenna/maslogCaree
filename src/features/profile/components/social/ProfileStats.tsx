import { Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS, PROFILE_SHADOW } from "../../config/profileTheme";
import type { ProfileStat } from "../../types/profile.types";
import StatItem from "./StatItem";

type ProfileStatsProps = {
  stats: ProfileStat[];
  loading: boolean;
  compact: boolean;
  unavailable?: boolean;
};

const PLACEHOLDERS: ProfileStat[] = [
  { key: "a", label: "Appointments", shortLabel: "Total", value: 0 },
  { key: "b", label: "Completed", shortLabel: "Done", value: 0 },
  { key: "c", label: "Upcoming", shortLabel: "Upcoming", value: 0 },
  { key: "d", label: "Cancelled", shortLabel: "Cancelled", value: 0 },
];

const ProfileStats = ({
  stats,
  loading,
  compact,
  unavailable = false,
}: ProfileStatsProps) => {
  const items = loading || stats.length === 0 ? PLACEHOLDERS : stats;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: SOCIAL_COLORS.surface,
        borderWidth: 1,
        borderColor: SOCIAL_COLORS.border,
        ...PROFILE_SHADOW.card,
      }}
    >
      {unavailable && !loading ? (
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            paddingVertical: 10,
            fontSize: 13,
            color: SOCIAL_COLORS.muted,
          }}
        >
          Statistics are unavailable right now.
        </Text>
      ) : (
        items.map((stat, index) => (
          <View key={stat.key} style={{ flex: 1, flexDirection: "row" }}>
            {index > 0 ? (
              <View
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  marginVertical: 4,
                  backgroundColor: SOCIAL_COLORS.divider,
                }}
              />
            ) : null}
            <StatItem
              label={compact ? stat.shortLabel : stat.label}
              value={stat.value}
              loading={loading}
              compact={compact}
            />
          </View>
        ))
      )}
    </View>
  );
};

export default ProfileStats;
