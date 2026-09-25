import FeedbackState, { type FeedbackStateProps } from "./FeedbackState";

type EmptyStateProps = Omit<FeedbackStateProps, "tone" | "icon"> & {
  icon?: FeedbackStateProps["icon"];
};

const EmptyState = ({ icon = "inbox", ...props }: EmptyStateProps) => (
  <FeedbackState {...props} icon={icon} tone="neutral" />
);

export default EmptyState;
