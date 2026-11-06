import DetailsModalShell from "@/components/ui/dialog/DetailsModalShell";

import ResidentDetailsFrame, { type ResidentDetailsFrameProps } from "./ResidentDetailsFrame";

const TWO_COLUMN_WIDTH = 880;
const STACKED_WIDTH = 640;

/**
 * Centred dialog for web from the tablet breakpoint up. The shared shell gives
 * it role="dialog" with aria-modal, the focus trap, Escape and scrim closing,
 * the page scroll lock, and focus back on whatever opened it.
 */
const ResidentDetailsModal = (props: ResidentDetailsFrameProps) => (
  <DetailsModalShell
    onClose={props.onClose}
    closeLabel="Close resident details"
    labelledBy={props.titleId}
    maxWidth={props.columns ? TWO_COLUMN_WIDTH : STACKED_WIDTH}
    clip
  >
    <ResidentDetailsFrame {...props} />
  </DetailsModalShell>
);

export default ResidentDetailsModal;
