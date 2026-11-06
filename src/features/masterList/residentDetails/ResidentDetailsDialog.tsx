import { useId } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";

import type { MasterResidentRecord } from "../masterList.types";
import ResidentDetailsModal from "./components/ResidentDetailsModal";
import ResidentDetailsSheet from "./components/ResidentDetailsSheet";
import { canEditResidentRecord } from "./residentDetailsAccess";
import { useResidentDetails } from "./useResidentDetails";

export type ResidentDetailsDialogProps = {
  /** The record's database id. The view fetches it; it never reads the list row. */
  recordId: string;
  onClose: () => void;
  /** Receives the freshly fetched record, never the list row. */
  onEdit: (record: MasterResidentRecord) => void;
};

/**
 * Resident details: a centred modal on web from the tablet breakpoint (two
 * columns from desktop), and a full-screen sheet on phones and in the app.
 * Mount it only while open, so the record leaves memory when it closes.
 */
const ResidentDetailsDialog = ({ recordId, onClose, onEdit }: ResidentDetailsDialogProps) => {
  const { state, retry } = useResidentDetails(recordId);
  const { user } = useAuth();
  const colors = useThemeColors();
  const { isDesktopWeb, isDesktop, isMobile } = useResponsive();
  const titleId = useId();

  const frame = {
    state,
    colors,
    titleId,
    columns: isDesktopWeb && isDesktop,
    compact: isMobile,
    canEdit: canEditResidentRecord(user?.role),
    onRetry: retry,
    onClose,
    onEdit,
  };

  return isDesktopWeb ? <ResidentDetailsModal {...frame} /> : <ResidentDetailsSheet {...frame} />;
};

export default ResidentDetailsDialog;
