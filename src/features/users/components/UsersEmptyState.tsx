import StateBlock from "@/components/ui/StateBlock";

type UsersEmptyStateProps = {
  error: string | null;
  hasActiveFilters: boolean;
  onRetry: () => void;
};

const UsersEmptyState = ({
  error,
  hasActiveFilters,
  onRetry,
}: UsersEmptyStateProps) => {
  if (error) {
    return (
      <StateBlock
        icon="alert-circle"
        tone="error"
        title="Unable to load users."
        body={error}
        action={{ label: "Try again", onPress: onRetry }}
      />
    );
  }

  return (
    <StateBlock
      icon="users"
      tone="neutral"
      title={hasActiveFilters ? "No users match your search." : "No users found."}
      body={
        hasActiveFilters
          ? "Try adjusting your search or filters."
          : "The database contains no registered users yet."
      }
    />
  );
};

export default UsersEmptyState;
