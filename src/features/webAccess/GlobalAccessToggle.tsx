import { useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { globalAccessCopy } from "@/features/users/admin/confirmCopy";
import api from "@/services/api";
import AccessLoadState from "./AccessLoadState";
import AccessToggle from "./AccessToggle";
import type { GlobalWebPolicy } from "./accessTypes";
import { useAccessResource } from "./useAccessResource";

const PATH = "/admin/resident-web-access";

/** The toolbar's switch: the default for residents with no individual setting. */
const GlobalAccessToggle = () => {
  const remote = useAccessResource<{ policy: GlobalWebPolicy }>(PATH);
  const [confirming, setConfirming] = useState(false);
  const policy = remote.data?.policy;

  if (!policy || remote.error) {
    return <AccessLoadState error={Boolean(remote.error)} onRetry={remote.refetch} />;
  }

  const copy = globalAccessCopy(!policy.enabled);
  const save = () => {
    setConfirming(false);
    void remote.mutate(async () => {
      await api.patch(PATH, { enabled: !policy.enabled, revision: policy.revision });
    }, "Resident web access setting saved");
  };

  return (
    <>
      <AccessToggle
        enabled={policy.enabled}
        busy={remote.busy}
        saving={remote.saving}
        label="Resident web access"
        hint="Asks you to confirm before changing"
        onChange={() => setConfirming(true)}
      />
      <ConfirmationModal
        visible={confirming}
        title={copy.title}
        message={copy.body}
        confirmLabel={copy.confirmLabel}
        destructive={copy.destructive}
        onConfirm={save}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
};

export default GlobalAccessToggle;
