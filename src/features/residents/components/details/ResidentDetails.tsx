import { useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
import ResidentDetailsPanel, { type ResidentDetailsProps } from "./ResidentDetailsPanel";
import ResidentDetailsSheet from "./ResidentDetailsSheet";

const ResidentDetails = (props: ResidentDetailsProps) => {
  const { width } = useWindowDimensions();

  return width < BREAKPOINTS.tablet ? (
    <ResidentDetailsSheet {...props} />
  ) : (
    <ResidentDetailsPanel {...props} />
  );
};

export default ResidentDetails;
