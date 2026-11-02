import { useState } from "react";
import { globalAccessCopy } from "@/features/users/admin/confirmCopy";
import api from "@/services/api";
import AccessLoadState from "./AccessLoadState";
import AccessToggle from "./AccessToggle";
import type { GlobalWebPolicy } from "./accessTypes";
import { useAccessResource } from "./useAccessResource";
import WebAccessConfirmDialog from "./WebAccessConfirmDialog";

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
  const save = async (reason: string) => {
    const saved = await remote.mutate(async () => {
      const { data } = await api.patch<{ policy: GlobalWebPolicy }>(PATH, { enabled: !policy.enabled, revision: policy.revision, reason: reason.trim() || null });
      return data;
    }, "Resident web access setting saved");
    if (saved) setConfirming(false);
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
      <WebAccessConfirmDialog
        visible={confirming}
        copy={copy}
        saving={remote.saving}
        onConfirm={(reason) => void save(reason)}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
};

export default GlobalAccessToggle;
