import { View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import CompleteModalShell from "@/components/medicalRecord/complete/CompleteModalShell";
import { CompletionPlaceholder, FooterButtons } from "@/components/medicalRecord/complete/CompletionChrome";

import type { RecordDetailState } from "../../hooks/useRecordDetail";
import type { MasterlistDetail, ResidentIdentity } from "../../types";
import { residentNameOf } from "../rowText";
import RecordDetailContent from "./RecordDetailContent";

type Props = {
  detail: RecordDetailState;
  /** Left out while an editor is already open (the detail then sits on top of it). */
  onEdit?: (detail: MasterlistDetail) => void;
  onShowHistory?: (resident: ResidentIdentity) => void;
};

/** One record for staff: centred on wide screens, a bottom sheet on phones. Loaded only when opened. */
const RecordDetailDialog = ({ detail, onEdit, onShowHistory }: Props) => {
  const palette = useAdminSurfacePalette();
  const loaded = detail.detail;

  const footer = loaded?.editable && onEdit ? (
    <FooterButtons backLabel="Close" onBack={detail.close} nextLabel="Edit record" onNext={() => onEdit(loaded)} busy={false} disabled={false} />
  ) : undefined;

  const body = () => {
    if (loaded) return <RecordDetailContent detail={loaded} onShowHistory={onShowHistory ? () => onShowHistory(loaded.resident) : undefined} />;
    if (detail.error) {
      return (
        <View className="items-center gap-3">
          <CompletionPlaceholder message={detail.error} error />
          <DashboardButton palette={palette} variant="secondary" icon="refresh-cw" label="Try again" onPress={detail.retry} />
        </View>
      );
    }
    return <CompletionPlaceholder message="Loading the medical record." />;
  };

  return (
    <CompleteModalShell
      visible={detail.isOpen}
      onRequestClose={detail.close}
      dismissible
      closeLabel="Close the medical record"
      title="Medical record"
      subtitle={loaded ? `${residentNameOf(loaded)}, ${loaded.serviceLabel}` : undefined}
      footer={footer}
    >
      {body()}
    </CompleteModalShell>
  );
};

export default RecordDetailDialog;
