import ProfileEmptyState from "./common/ProfileEmptyState";

type ProfileErrorStateProps = {
  onRetry?: () => void;
  message?: string;
};

const ProfileErrorState = ({ onRetry, message }: ProfileErrorStateProps) => (
  <ProfileEmptyState
    icon="alert-circle"
    tone="error"
    title="We could not load your profile"
    body={message ?? "Check your connection, then try again."}
    action={onRetry ? { label: "Try again", onPress: onRetry } : undefined}
  />
);

export default ProfileErrorState;
