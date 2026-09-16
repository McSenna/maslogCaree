import { View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS, PROFILE_SHADOW } from "../../config/profileTheme";
import type { ProfileActivityItem } from "../../types/profile.types";
import ActivityRow from "../cards/ActivityRow";
import ProfileTabState from "../common/ProfileTabState";

type ActivityTabProps = {
  activity: ProfileActivityItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

const ActivityTab = ({ activity, loading, error, onRetry }: ActivityTabProps) => {
  if (loading || error || activity.length === 0) {
    return (
      <ProfileTabState
        loading={loading}
        error={error}
        isEmpty={activity.length === 0}
        emptyIcon="activity"
        emptyTitle="No recent activity"
        emptyBody="Updates about your appointments and account will show up here."
        onRetry={onRetry}
        skeletonRows={4}
      />
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: SOCIAL_COLORS.surface,
        borderWidth: 1,
        borderColor: SOCIAL_COLORS.border,
        ...PROFILE_SHADOW.card,
      }}
    >
      {activity.map((item, index) => (
        <ActivityRow
          key={item.id}
          item={item}
          showDivider={index < activity.length - 1}
        />
      ))}
    </View>
  );
};

export default ActivityTab;
