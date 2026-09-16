import StateBlock from "@/components/ui/StateBlock";

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
        title="Unable to load residents."
        body={error}
        action={{ label: "Try again", onPress: onRetry }}
      />
    );
  }

  return (
    <StateBlock
      icon="users"
      tone="neutral"
      title={hasActiveFilters ? "No residents match your search." : "No residents found."}
      body={
        hasActiveFilters
          ? "Try a different name, resident ID, or status."
          : "Registered residents will appear here."
      }
    />
  );
};

export default ResidentsEmptyState;
