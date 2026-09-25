import { View, useWindowDimensions } from "react-native";

import DetailsModalShell from "@/components/ui/dialog/DetailsModalShell";

import type { ResidentRecord } from "../../services/residentService";

import { PanelBody } from "./panel/PanelBody";
import { PanelHeader, TITLE_ID } from "./panel/PanelHeader";

const MAX_WIDTH = 860;

const TWO_COLUMN_WIDTH = 820;

export type ResidentDetailsProps = {
  visible: boolean;
  resident: ResidentRecord | null;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const ResidentDetailsPanel = ({
  visible,
  resident,
  onClose,
  loading = false,
  error = null,
  onRetry,
}: ResidentDetailsProps) => {
  const { width } = useWindowDimensions();
  const compact = width < TWO_COLUMN_WIDTH;

  return (
    <DetailsModalShell
      visible={visible}
      onClose={onClose}
      closeLabel="Close resident details"
      labelledBy={TITLE_ID}
      maxWidth={MAX_WIDTH}
    >
      <View className="px-7 pb-5 pt-7">
        <PanelHeader onClose={onClose} />
      </View>

      <PanelBody
        resident={resident}
        loading={loading}
        error={error}
        onRetry={onRetry}
        compact={compact}
      />
    </DetailsModalShell>
  );
};

export default ResidentDetailsPanel;
