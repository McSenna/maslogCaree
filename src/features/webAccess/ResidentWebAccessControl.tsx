import { useState } from "react";
import { Text, View } from "react-native";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { webAccessCopy } from "@/features/users/admin/confirmCopy";
import { portalAccessLines } from "@/features/users/admin/portalAccessDisplay";
import type { WebOverride } from "@/features/users/admin/userAdmin.types";
import { setWebOverride } from "@/features/users/admin/services/userAdminApi";
import { buildDisplayId } from "@/features/profile/utils/profileHelpers";
import { TYPE } from "@/theme/typography";
import AccessLoadState from "./AccessLoadState";
import type { ResidentWebAccess } from "./accessTypes";
import { useAccessResource } from "./useAccessResource";
import WebAccessConfirmDialog from "./WebAccessConfirmDialog";

const RESIDENT_ID_PREFIX = "RES";
const CHOICES: readonly { override: WebOverride; label: string }[] = [
  { override: "allow", label: "Enable web access" },
  { override: "block", label: "Disable web access" },
  { override: null, label: "Use global setting" },
];

type Props = { residentId: string; residentName: string };

const ResidentWebAccessControl = ({ residentId, residentName }: Props) => {
  const palette = useAdminSurfacePalette();
  const remote = useAccessResource<{ access: ResidentWebAccess }>(`/admin/users/${residentId}/web-access`);
  const [pending, setPending] = useState<{ override: WebOverride } | null>(null);
  const access = remote.data?.access;
  if (!access || remote.error) return <AccessLoadState error={Boolean(remote.error)} onRetry={remote.refetch} />;

  const lines = portalAccessLines(access.state);
  const identity = `${residentName} (${buildDisplayId(residentId, RESIDENT_ID_PREFIX)})`;
  const save = async (reason: string) => {
    if (!pending) return;
    const saved = await remote.mutate(() => setWebOverride(residentId, pending.override, access.revision, reason), "Resident web access saved");
    if (saved) setPending(null);
  };

  return (
    <View className="gap-3 py-3">
      <Text accessibilityLiveRegion="polite" style={[TYPE.bodyStrong, { color: palette.heading }]}>{lines.line1}</Text>
      <Text style={[TYPE.body, { color: palette.body }]}>{access.reason}</Text>
      {access.eligible ? (
        <View className="flex-row flex-wrap gap-2">
          {CHOICES.filter((choice) => choice.override !== access.override).map((choice) => (
            <DashboardButton
              key={choice.label}
              palette={palette}
              variant="secondary"
              label={choice.label}
              disabled={remote.busy}
              onPress={() => setPending({ override: choice.override })}
            />
          ))}
        </View>
      ) : null}
      <Text style={[TYPE.caption, { color: palette.muted }]}>This setting never approves, verifies or reactivates an account.</Text>
      <WebAccessConfirmDialog
        visible={pending !== null}
        copy={pending ? webAccessCopy(pending.override, identity, access.globalEnabled) : null}
        saving={remote.saving}
        onConfirm={(reason) => void save(reason)}
        onCancel={() => setPending(null)}
      />
    </View>
  );
};
export default ResidentWebAccessControl;
