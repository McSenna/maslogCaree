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
      title={hasActiveFilters ? "No users match your search" : "No users yet"}
      body={
        hasActiveFilters
          ? "Try adjusting your search or filters."
          : "Users appear here once they register or an admin adds them."
      }
    />
  );
};

export default UsersEmptyState;
