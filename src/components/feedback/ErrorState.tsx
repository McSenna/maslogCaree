import { friendlyErrorMessage } from "@/utils/friendlyError";
import FeedbackState from "./FeedbackState";

type ErrorStateProps = {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  retrying?: boolean;
  compact?: boolean;
};

const ErrorState = ({ title = "Something went wrong", message, onRetry, retrying, compact }: ErrorStateProps) => (
  <FeedbackState
    icon="wifi-off"
    tone="error"
    title={title}
    description={friendlyErrorMessage(message)}
    compact={compact}
    action={onRetry ? { label: "Try again", onPress: onRetry, loading: retrying } : undefined}
  />
);

export default ErrorState;
