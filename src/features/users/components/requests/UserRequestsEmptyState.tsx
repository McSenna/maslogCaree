import StateBlock from "@/components/ui/StateBlock";
import type { RequestStatusFilter } from "../../hooks/useUserRequests";

type UserRequestsEmptyStateProps = {
  error: string | null;
  hasActiveFilters: boolean;
  status: RequestStatusFilter;
  onRetry: () => void;
};

const EMPTY_COPY: Record<RequestStatusFilter, { title: string; body: string }> = {
  pending: {
    title: "No registrations awaiting verification.",
    body: "New resident registrations will appear here for review as they are submitted.",
  },
  approved: {
    title: "No approved registrations yet.",
    body: "Registrations you approve will be listed here.",
  },
  rejected: {
    title: "No rejected registrations.",
    body: "Registrations you turn down will be listed here with the reason given.",
  },
  all: {
    title: "No registration requests found.",
    body: "No resident has submitted a registration for verification yet.",
  },
};

const UserRequestsEmptyState = ({
  error,
  hasActiveFilters,
  status,
  onRetry,
}: UserRequestsEmptyStateProps) => {
  if (error) {
    return (
      <StateBlock
        icon="alert-circle"
        tone="error"
        title="Unable to load registration requests."
        body={error}
        action={{ label: "Try again", onPress: onRetry }}
      />
    );
  }

  if (hasActiveFilters) {
    return (
      <StateBlock
        icon="search"
        tone="neutral"
        title="No requests match your search."
        body="Try adjusting your search, ID type or date filters."
      />
    );
  }

  const copy = EMPTY_COPY[status] ?? EMPTY_COPY.all;

  return <StateBlock icon="inbox" tone="neutral" title={copy.title} body={copy.body} />;
};

export default UserRequestsEmptyState;
