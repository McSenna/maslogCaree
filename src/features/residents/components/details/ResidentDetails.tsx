import { useResponsive } from "@/hooks/useResponsive";
import ResidentDetailsPanel, { type ResidentDetailsProps } from "./ResidentDetailsPanel";
import ResidentDetailsSheet from "./ResidentDetailsSheet";

const ResidentDetails = (props: ResidentDetailsProps) => {
  const { isMobile } = useResponsive();

  return isMobile ? (
    <ResidentDetailsSheet {...props} />
  ) : (
    <ResidentDetailsPanel {...props} />
  );
};

export default ResidentDetails;
