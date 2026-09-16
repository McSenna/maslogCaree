import type { ProfileIconName } from "../../types/profile.types";
import ProfileEmptyState from "./ProfileEmptyState";
import TabSkeleton from "./TabSkeleton";

type ProfileTabStateProps = {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyIcon: ProfileIconName;
  emptyTitle: string;
  emptyBody: string;
  onRetry?: () => void;
  skeletonRows?: number;
};

const ProfileTabState = ({
  loading,
  error,
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptyBody,
  onRetry,
  skeletonRows = 3,
}: ProfileTabStateProps) => {
  if (loading) return <TabSkeleton rows={skeletonRows} />;

  if (error) {
    return (
      <ProfileEmptyState
        icon="wifi-off"
        tone="error"
        title="We could not load this section"
        body={error}
        action={onRetry ? { label: "Try again", onPress: onRetry } : undefined}
      />
    );
  }

  if (isEmpty) {
    return <ProfileEmptyState icon={emptyIcon} title={emptyTitle} body={emptyBody} />;
  }

  return null;
};

export default ProfileTabState;
