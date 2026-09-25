import DetailsModalHeader from "@/components/ui/dialog/DetailsModalHeader";

export const TITLE_ID = "resident-details-title";

export const PanelHeader = ({ onClose }: { onClose: () => void }) => (
  <DetailsModalHeader
    icon="user"
    title="Resident Details"
    subtitle="Registered resident information"
    titleId={TITLE_ID}
    titleSize={22}
    closeLabel="Close resident details"
    onClose={onClose}
  />
);
