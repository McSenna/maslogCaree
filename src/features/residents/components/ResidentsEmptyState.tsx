import StateBlock from "@/components/ui/StateBlock";

export const RESIDENTS_ERROR = "Unable to load residents.";

/** Nothing registered yet, or nothing matching the search and status. */
export const residentsEmptyCopy = (hasActiveFilters: boolean) => ({
  title: hasActiveFilters ? "No residents match your search." : "No residents found.",
  body: hasActiveFilters ? "Try a different name, resident ID, or status." : "Registered residents will appear here.",
});

type ResidentsEmptyStateProps = {
  error: string | null;
  hasActiveFilters: boolean;
  onRetry: () => void;
};

const ResidentsEmptyState = ({ error, hasActiveFilters, onRetry }: ResidentsEmptyStateProps) => {
  if (error) {
    return (
      <StateBlock
        icon="alert-circle"
        tone="error"
        title={RESIDENTS_ERROR}
        body={error}
        action={{ label: "Try again", onPress: onRetry }}
      />
    );
  }

  const copy = residentsEmptyCopy(hasActiveFilters);
  return <StateBlock icon="users" tone="neutral" title={copy.title} body={copy.body} />;
};

export default ResidentsEmptyState;
