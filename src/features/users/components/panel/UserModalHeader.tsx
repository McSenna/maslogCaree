import DetailsModalHeader from "@/components/ui/dialog/DetailsModalHeader";

export const TITLE_ID = "user-details-title";

export const UserModalHeader = ({ onClose }: { onClose: () => void }) => (
  <DetailsModalHeader
    icon="user"
    title="User Details"
    subtitle="Manage account information and access"
    titleId={TITLE_ID}
    closeLabel="Close user details"
    onClose={onClose}
  />
);
